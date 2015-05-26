declare module ns_testModule {
    /**
     * ClassTwo
     */
    class ClassTwo extends ns_test.ClassTwo {
        constructor();
    }
}

declare module ns_testModule {
    class ClassOne extends ns_test.ClassOne {
        constructor();
        testMethod(): void;
    }
}

declare module testModule {
}
