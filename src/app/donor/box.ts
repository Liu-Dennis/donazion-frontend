export class Box {
    box_id : number
    dc_id : string
    uid : number
    item?: Item[]

    constructor(box_id: number, donationcenter_id: string){
        this.dc_id = donationcenter_id
        this.box_id = box_id
        this.uid = -1
    }

    incUid(){
        this.uid = this.uid + 1
        return this.uid
    }

    removeItem(uid: number){
        let list = []
        if (this.item !== undefined){
            for (let i = 0; i < this.item.length; i++){
                if (this.item[i].uid != uid){
                    list.push(this.item[i])
                }
            }
            this.item = list
            return true
        }
        return false
    }
}

export class Item {
    uid : number
    item_id : number
    item_value : number

    constructor(uid: number, item_id: number, item_value: number){
        this.uid = uid
        this.item_id = item_id
        this.item_value = item_value
    }
}

//litreally the same as IP2
export class Model {
    boxes : Box[]
    bid : number

    constructor() {
        this.boxes = []
        this.bid = -1
    }

    incBid(){
        this.bid += 1
        return this.bid
    }

    removeBox(bid: number){
        let list = []
        if (this.boxes !== undefined){
            for (let i = 0; i < this.boxes.length; i++){
                if (this.boxes[i].box_id != bid){
                    list.push(this.boxes[i])
                }
            }
            this.boxes = list
            return true
        }
        return false
    }
}