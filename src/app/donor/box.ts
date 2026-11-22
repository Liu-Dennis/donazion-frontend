export class Box {
    dc_id : string
    item?: Item[]

    constructor(donationcenter_id: string){
        this.dc_id = donationcenter_id
    }
}

export class Item {
    item_id : number
    item_value : number

    constructor(item_id: number, item_value: number){
        this.item_id = item_id
        this.item_value = item_value
    }
}

//litreally the same as IP2
export class Model {
    boxes : Box[]

    constructor() {
        this.boxes = []
    }
}