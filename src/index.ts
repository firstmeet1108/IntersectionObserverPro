type IntersectionObserverProEntry = {
  data: unknown;
} & IntersectionObserverEntry;

type IntersectionObserverProCallback = (
  entrys: IntersectionObserverProEntry[],
  observer?: IntersectionObserverPro,
) => void;

type IntersectionObserverProInit = IntersectionObserverInit & {
  getKey?: (target: Element) => unknown;
  beforeUnobserve?: BeforeUnobserve;
};

type BeforeUnobserve = (
  key: unknown,
  observer: IntersectionObserverPro,
) => void;

export class IntersectionObserverPro extends IntersectionObserver {
  dataMap: Map<unknown, unknown> = new Map();
  getKey = (target: Element): unknown => target;
  private beforeUnobserve: BeforeUnobserve = (key, observer) => {
    observer.dataMap.delete(key);
  };
  constructor(
    callback: IntersectionObserverProCallback,
    options?: IntersectionObserverProInit,
  ) {
    const { getKey, ...superOptions } = options || {};
    super((entrys) => {
      callback(
        entrys.map((entry) => {
          return Object.assign(entry, {
            data: this.dataMap.get(this.getKey(entry.target)),
          });
        }),
        this,
      );
    }, superOptions);
    this.getKey = getKey || this.getKey;
    this.beforeUnobserve = options?.beforeUnobserve || this.beforeUnobserve;
  }
  observe(target: Element | null, data: unknown = {}): void {
    if (target) {
      const key = this.getKey(target);
      if (this.dataMap.has(key)) {
        return;
      }
      this.dataMap.set(key, data);
      super.observe(target);
    } else {
      throw new Error('target is null');
    }
  }
  unobserve(target: Element | null): void {
    if (!target) {
      throw new Error('target is null');
    }
    const key = this.getKey(target);
    this.beforeUnobserve(key, this);
    super.unobserve(target);
  }
  disconnect(): void {
    this.dataMap.clear();
    super.disconnect();
  }
}
