

function log(a:any, b:any, c:any){
	
}




module ns_testModule {


	export class ClassOne extends ns_test.BaseOne {

		constructor(){
			
			super();
			
		}

		public testMethod() : void
		{
			console.log("TestModule!");
			super.testMethod();
		}
	}
}
