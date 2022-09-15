import { Hashtag } from './htsrp.namespace';
import { Observable } from 'rxjs';
import { HtsRpService } from './htsrp.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './htsrp.component.html',
  styleUrls: ['./htsrp.component.css']
})
export class HtsRpComponent implements OnInit {
  title = 'hts-rp';

  public maxListSize: Observable<number>;
  public groupList: Observable<{ name: string, active?: boolean }[]>;
  public hashtagList: string = '';
  public stats: { name: string, number: number }[] = [];

  constructor(
    private readonly hashtagService: HtsRpService
  ) { }

  ngOnInit(): void {
    this.maxListSize = this.hashtagService.getMaxListSize();
    this.groupList = this.hashtagService.getGroupList();

    this.hashtagService.getHashtagList().subscribe((hashtags: Hashtag[]) => {
      this.hashtagList = '';
      hashtags.forEach((hashtag: Hashtag) => {
        this.hashtagList += '#' + hashtag.tag + ' ';
        this.addStat(hashtag.tag);
      });
    });
  }

  public refresh(): void {
    this.hashtagService.updateHashtagList();
  }

  public setMaxListSize(size: number): void {
    this.hashtagService.setMaxListSize(size);
  }

  public toggleGroupActive(name: string): void {
    this.hashtagService.toggleGroupActive(name);
  }

  public addStat(tag: string): void {
    const stat = this.stats.find(s => s.name === tag);

    if (!stat) {
      this.stats.push({ name: tag, number: 0 });
    }

    this.stats.find(s => s.name === tag).number++;

    this.stats.sort((a, b) => b.number - a.number);
  }
}
