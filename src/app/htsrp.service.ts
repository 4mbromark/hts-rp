import { Hashtag, HashtagPickerConfig, HashtagGroup } from './htsrp.namespace';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';

@Injectable()
export class HtsRpService {

  private configuration: HashtagPickerConfig;

  private maxListSize: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private groupList: BehaviorSubject<{ name: string, active?: boolean }[]> = new BehaviorSubject<{ name: string, active?: boolean }[]>([]);
  private hashtagList: ReplaySubject<Hashtag[]> = new ReplaySubject<Hashtag[]>();

  constructor(
    private readonly http: HttpClient
  ) {
    this.http.get('assets/config/config.json').subscribe((data: HashtagPickerConfig) => {
      this.setConfiguration(data).then(() => {
        this.maxListSize.next(this.configuration.number);
        this.groupList.next(this.configuration.groups.map(g => ({ name: g.name, active: g.default })));
        this.updateHashtagList();
      }, () => {
        this.showError('ci sono dei problemi con il file config, vedi in console');
      });
    }, (error: HttpErrorResponse) => {
      console.log(error);
    });
  }

  public getConfiguration(): HashtagPickerConfig {
    return this.configuration;
  }

  public getMaxListSize(): Observable<number> {
    return this.maxListSize.asObservable();
  }

  public getGroupList(): Observable<{ name: string, active?: boolean }[]> {
    return this.groupList.asObservable();
  }

  public getHashtagList(): Observable<Hashtag[]> {
    return this.hashtagList.asObservable();
  }

  public setConfiguration(configuration: HashtagPickerConfig): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let error: boolean = false;

      configuration.groups.forEach((group: HashtagGroup) => {
        group.list.forEach((hashtag: Hashtag) => {
          if (!hashtag.tag || hashtag.tag.length === 0 || hashtag.tag.includes(' ')) {
            console.error('tag [%s] parametro non valido', hashtag.tag);
            error = true;
          }

          if (
            hashtag.alwaysKeep && hashtag.oneOf ||
            hashtag.alwaysKeep && hashtag.uniqueFor ||
            hashtag.oneOf && hashtag.uniqueFor
          ) {
            console.error('alwaysKeep | oneFor | uniqueFor [%s] i tre parametri non possono coesistere', hashtag.tag);
            error = true;
          }
        });
      });

      if (error) {
        reject();
      }

      this.configuration = configuration;
      resolve();
    });
  }

  public setMaxListSize(size: number): void {
    this.maxListSize.next(size);
    this.updateHashtagList();
  }

  public toggleGroupActive(name: string): void {
    const group: { name: string, active?: boolean } = this.groupList.getValue().find(g => g.name === name);
    group.active = !group.active;
    this.updateHashtagList();
  }

  public updateHashtagList(): void {
    let list: Hashtag[] = [];

    this.groupList.getValue().filter(g => g.active).forEach((group: { name: string, active?: boolean }) => {
      list = list.concat(this.configuration.groups.find(g => g.name === group.name).list);
    });

    /* list.filter(h => (h.oneOf || h.uniqueFor) && !h.alwaysKeep).forEach((hashtag: Hashtag) => {
      const sublist: Hashtag[] = list.filter(h => hashtag.oneOf ? h.oneOf === hashtag.oneOf : h.uniqueFor === hashtag.uniqueFor);
      const index: number = Math.floor(Math.random() * sublist.length);

      sublist.filter(h => sublist.indexOf(h) !== index).forEach((ht: Hashtag) => {
        list.splice(list.indexOf(ht), 1);
      });
    }); */

    if (list.filter(h => h.alwaysKeep /*|| h.oneOf*/).length > this.maxListSize.getValue()) {
      this.showError('il numero di hashtag richiesti è inferiore agli hashtag obbligatori');
      return;
    }

    while (list.length > this.maxListSize.getValue()) {
      const index: number = Math.floor(Math.random() * list.length);
      const hashtag: Hashtag = list[index];

      if (hashtag.alwaysKeep /*|| hashtag.oneOf*/) {
        // continue;
      }

      list.splice(index, 1);
    }

    this.hashtagList.next(list);
  }

  public showError(error: string): void {
    this.hashtagList.next([{ tag: error }]);
  }
}
