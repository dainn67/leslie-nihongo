export class UserProgress {
  constructor(
    public id: string = "",
    public level: string = "",
    public target: string = "",
    public startDate: number = Date.now(),
    public examDate: number = Date.now(),
    public lastUpdated: number = Date.now()
  ) {}

  toString(): string {
    return `UserProgress(level: ${this.level}, target: ${this.target}, startDate: ${this.startDate}, examDate: ${this.examDate}, lastUpdated: ${this.lastUpdated})`;
  }

  toJSON() {
    return {
      id: this.id,
      level: this.level,
      target: this.target,
      startDate: this.startDate,
      examDate: this.examDate,
      lastUpdated: this.lastUpdated,
    };
  }
}
