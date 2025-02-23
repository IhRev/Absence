export class Absence {
    constructor(
        public id: number,
        public name: string,     
        public type: string,        
        public startDate: Date,   
        public endDate: Date,
        public userId: number
    ) { }
}