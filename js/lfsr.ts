class lfsr {
    public cur_num:number
    private len:number
    private base:number
    private mask:number

    constructor(seed:number){
        this.len = 10
        this.base = Math.pow(2, this.len)
        this.mask = this.base - 1
        this.cur_num = seed & this.mask
    }

    public getCur():number {
        return this.cur_num / this.base
    }

    public getNext():number {
        var bit32:number = ((1 << 31) & this.cur_num)  >> 31
        var bit22:number = ((1 << 21) & this.cur_num) >> 21
        var bit2: number = ((1 << 1) & this.cur_num) >> 1
        var bit1: number = ((1 << 0) & this.cur_num) >> 0
        var newbit = bit1 ^ bit2 ^ bit22 ^ bit32
        this.cur_num = ((this.cur_num >> 1) | (newbit << (this.len - 1))) & this.mask
        return this.cur_num / this.base
    }
}
