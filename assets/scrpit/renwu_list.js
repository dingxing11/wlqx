// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var player = require("Player")
cc.Class({
    extends: cc.Component,

    properties: {
        title:'',
        item:'',
        Nname:{
            default:null,
            type:cc.Prefab
        },
        Ncontent:{
            default:null,
            type:cc.Node
        },
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.Ncontent = cc.find("Canvas/main/node/list/shuxing/name/view/content")
        var xm = cc.find("Canvas/main/node/list/view/content/label_list/xm")
        var ack = cc.find("Canvas/main/node/list/view/content/label_list/ack")
        var def = cc.find("Canvas/main/node/list/view/content/label_list/def")
        var hp = cc.find("Canvas/main/node/list/view/content/label_list/hp")
        var mp = cc.find("Canvas/main/node/list/view/content/label_list/mp")
        var exp = cc.find("Canvas/main/node/list/view/content/label_list/exp")
        var jj = cc.find("Canvas/main/node/list/view/content/label_list/jj")
        var jn = cc.find("Canvas/main/node/list/view/content/label_list/jn")
        var money = cc.find("Canvas/main/node/list/view/content/label_list/money")
        this.name = xm.getComponent(cc.Label)
        this.ack1 = ack.getComponent(cc.Label)
        this.def1 = def.getComponent(cc.Label)
        this.hp1 = hp.getComponent(cc.Label)
        this.mp1 = mp.getComponent(cc.Label)
        this.exp1 = exp.getComponent(cc.Label)
        this.jj1 = jj.getComponent(cc.Label)
        this.jn1 = jn.getComponent(cc.Label)
        this.money1 = money.getComponent(cc.Label)
    },

    start () {
        this.node.on('select-renwu',event => {
            this.item = event.getUserData()
            this.selectItem(this.item)
        },this)
    },
    
    updatePlayerStatus(person){
        cc.log(person.Name)
        cc.log(this.name.string)
        this.name.string = `姓名:${person.Name}`
        this.ack1.string = `攻击:${person.ack}`
        this.def1.string = `防御:${person.def}`
        this.hp1.string = `血量:${person.HP}`
        this.mp1.string = `内力:${person.MP}`
        this.exp1.string = `修为:${person.EXP}/${person.MAXEXP}`
        this.jj1.string = `境界:${person.LEVEL}`
        this.money1.string = `元宝:${person.money}`
        let wugong = ''
        person.WUGONG.forEach(element => {
            wugong += element.name + ','
        });
        this.jn1.string = `武功:${wugong}`
    },

    onEnable(){
        this.clearItems()
        this.ItemList()
    },
    
     // 清除titles
    clearTitles(){
        var nodes = this.Ntab.children
        nodes.forEach(node =>{
            node.destroy()
        })
    },

    // 清除items
    clearItems(){
        var nodes = this.Ncontent.children
        nodes.forEach(node =>{
            node.destroy()
        })
    },

    // 列举相应title下的全部值
    ItemList(){
        let items = new Array()
        var item = cc.instantiate(this.Nname);
        var item_label = item.getComponent(cc.Label);
        item_label.string = player.Name;
        items.push(item_label.string)
        this.Ncontent.addChild(item)
        player.huoban.forEach(row => {
            var item = cc.instantiate(this.Nname);
            var item_label = item.getComponent(cc.Label);
            item_label.string = row.Name;
            items.push(item_label.string)
            this.Ncontent.addChild(item)
        });
        // 选中第一个item
        this.item = items[0]
        this.selectItem(this.item);
    },

    // 选中item显示的详情
    selectItem(item){
        if(player.Name === item){
            this.renwu = player
            return
        }
        player.huoban.forEach(row => {
            if(row.Name === item){
                console.log(row)
                this.renwu = row
            }
        });
    },

    useItme(){
        player.BeiBao.forEach((row,i) => {
            if(row.name === this.item){
                cc.log(row.num);
                let index = true
                player.WUGONG.forEach(element =>{
                    if(row.name === element.name){
                        cc.log('已经学会该武功')
                        index = false
                    }
                    cc.log(element.name)
                })
                if(index){
                    player.WUGONG.push(row)
                    let title = this.Nshuoming.getChildByName("title");
                    let num = this.Nshuoming.getChildByName("num");
                    let body = this.Nshuoming.getChildByName("body");
                    let details = body.getChildByName("details");
                    let title_label = title.getComponent(cc.Label);
                    let details_label = details.getComponent(cc.Label);
                    let num_label = num.getComponent(cc.Label);
                    if(row.num > 1) {
                        row.num = parseInt(row.num) - 1
                        num_label.string = `数量:${row.num}`;    
                    } else {
                        cc.log('数量是1销毁')
                        player.BeiBao.splice(i,1)
                        title_label.string = `名称:`;
                        details_label.string = ``;
                        num_label.string = `数量:`;
                        let nodes = this.Ncontent.children;
                        nodes.forEach(element => {
                            let element_label = element.getComponent(cc.Label);
                            cc.log(element_label.string+'11')
                            cc.log(row.name+'12')
                            if(element_label.string == row.name){
                                cc.log('destroy');
                                element.destroy();
                            }
                        })
                    }
                }      
            }
        });
    },

    update (dt) {
        this.updatePlayerStatus(this.renwu)
    },
});