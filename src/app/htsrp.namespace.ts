export class HashtagPickerConfig {
  number: number;
  controlValues: HashtagControlValues;
  groups: HashtagGroup[];
}

export class HashtagControlValues {
  uniqueness?: boolean;
  minimums?: boolean;
  deactivations?: boolean;
  skiplines?: boolean;
}

export class HashtagGroup {
  name: string;
  default?: boolean;
  hide?: boolean;
  list: Hashtag[];
}

export class Hashtag {
  tag: string;
  alwaysKeep?: boolean;
  oneOf?: string;
  uniqueFor?: string;
  disabled?: boolean;
}
