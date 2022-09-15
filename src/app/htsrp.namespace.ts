export class HashtagPickerConfig {
  number: number;
  groups: HashtagGroup[];
}

export class HashtagGroup {
  name: string;
  default?: boolean;
  list: Hashtag[];
}

export class Hashtag {
  tag: string;
  alwaysKeep?: boolean;
  oneOf?: string;
  uniqueFor?: string;
}
