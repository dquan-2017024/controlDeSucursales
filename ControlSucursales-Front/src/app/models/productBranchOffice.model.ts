export class ProductBranchOfficeModel{
    constructor(
        public id: string,
        public name: string,
        public provider: string,
        public stock: number,
        public sales: number,
        public branchOffice: string,
        public enterprise: string
    ){}
}