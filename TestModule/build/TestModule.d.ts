declare function log(a: any, b: any, c: any): void;
declare module ns_testModule {
    class ClassOne extends ns_test.BaseOne {
        constructor();
        testMethod(): void;
    }
}

declare module ns_testModule {
    /**
     * ClassTwo
     */
    class ClassTwo extends ns_test.BaseTwo {
        constructor();
    }
}

declare module testModule {
}
