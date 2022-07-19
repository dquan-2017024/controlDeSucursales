export class ProductEnterpriseModel{
    constructor(
        public id: string,
        public name: string,
        public provider: string,
        public stock: number,
        public enterprise: string
    ){}
}