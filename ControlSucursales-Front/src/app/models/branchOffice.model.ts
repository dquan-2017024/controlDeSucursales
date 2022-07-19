export class BranchOfficeModel{
    constructor(
        public id: string,
        public name: string,
        public address: string,
        public businessHours: string,
        public phone: string,
        public enterprise: string
    ){}
}