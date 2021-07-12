<template>
   <div id='app'>
     <div class='title'>生单页</div>
     <div class='card address_box'>
          <div class='send'>
            <img src='https://cdn.kuaidi100.com/images/m/dispatch/ico_send.png'>
            <div class='send_address' @click='selSendAddress'>{{goAddress ? goAddress : '请输入寄件地址'}}}</div>
          </div>
       <div class='receive'>
         <img src='https://cdn.kuaidi100.com/images/m/dispatch/ico_shou.png'>
         <div class='receive_address' @click='selReceiveAddress'>{{toAddress ? toAddress : '请输入收件地址'}}}</div>
       </div>
     </div>
     <div class='card shopInfo'>
       <div>商品信息</div>
       <input placeholder='请输入物品信息' v-model='shopName'/>
       <input type='number' placeholder='请输入物品kg' v-model='wight' @blur="checkMatchChannel">
       <div class="my_price_box">
         <input placeholder='请输入物品运费' v-model='myPrice'/>
         <input type="radio" v-model='channel' value="微信" checked /><span>微信</span>
         <input type="radio" v-model='channel' value="支付宝"/><span>支付宝</span>
         <input type="radio" v-model='channel' value="闲鱼"/><spna>闲鱼</spna>
       </div>

     </div>
     <div class='bottom'>

       <div class='price'>
         <div class='max_price'>￥{{maxPrice}}</div>
         <span>{{ priceObj }}</span>
       </div>
       <div class='createOrder' @click="createOrder" v-show="show">京东下单</div>
       <div class='createOrder createOrderEnable' v-show="!show">京东下单</div>
     </div>
   </div>
</template>

<script>
import local from '../utils/storage'
export default {
  name: 'SendPost',
  data () {
    return {
      goAddress: '',
      toAddress: '',
      sendAddress: '',
      receiveAddres: '',
      priceObj: '',
      shopName: '',
      wight: 1,
      maxPrice: 0,
      channel:'',
      myPrice:'',
      show: false
    }
  },
  created () {
    this.sendAddress = local.get('sendAddress')
    if (this.sendAddress) {
      this.goAddress = this.sendAddress['contact'] + ' ' + this.sendAddress['mobile'] + '\n' + this.sendAddress['province'] + '/' + this.sendAddress['city'] + '/' + this.sendAddress['county'] + '/' + this.sendAddress['town'] + '/' + this.sendAddress['address']
    }
    this.receiveAddres = local.get('receiveAddress')
    if (this.receiveAddres) {
      this.toAddress = this.receiveAddres['contact'] + ' ' + this.receiveAddres['mobile'] + '\n' + this.receiveAddres['province'] + '/' + this.receiveAddres['city'] + '/' + this.receiveAddres['county'] + '/' + this.receiveAddres['town'] + '/' + this.receiveAddres['address']
    }
    if (this.sendAddress && this.receiveAddres) {
      this.checkMatchChannel()
    }
  },
  methods: {
    selSendAddress () {
      this.$router.push({name: 'WriteAddress', query: { flag: 'go' }})
    },
    selReceiveAddress () {
      this.$router.push({name: 'WriteAddress', query: { flag: 'to' }})
    },
    checkMatchChannel () {
      let requestData = {
        'senderProvince': this.sendAddress['province'],
        'senderCity': this.sendAddress['city'],
        'senderCounty': this.sendAddress['county'],
        'senderTown': this.sendAddress['town'],
        'receiveProvince': this.receiveAddres['province'],
        'receiveCity': this.receiveAddres['city'],
        'receiveTown': this.receiveAddres['town'],
        'receiveCounty': this.receiveAddres['county'],
        'packageCount': 1, // 包裹数
        'weight': this.wight, // 重量 kg
        'tempReceiveAddress': this.toAddress, //
        'tempSendAddress': this.sendAddress, //
        'customerFreightType': '微信', //
        'linkName': 'yywl-袁宇进' //
      }
      this.$post('/jdserver2/checkMatchChannel', requestData)
        .then((res) => {
          console.log(res)
          let re = res['result']
          if (re && res['code'] === '1') {
            let priceObj = re['price']
            this.maxPrice = re['freight']
            this.priceObj = '首重' + priceObj['priceOne'] + '  2KG:' + priceObj['priceTwo'] + '  3KG:' + priceObj['priceThree'] + '\n4KG:' + priceObj['priceFour'] +
              '  5KG:' + priceObj['priceFive'] + '  续重:' + priceObj['priceMore']
            this.show = true
          } else {
            this.show = false
            alert(re)
          }
        })
    },
    createOrder () {
      if (!this.shopName || !this.wight) {
        alert('请输入商品名字 或者重量')
        return
      }
      if (!this.myPrice) {
        alert('请输入运费')
        return
      }
      this.show = false
      let order = {
        'shopbill': null,
        'user': null,
        'sender': this.sendAddress['contact'], // 发见人
        'senderCompany': null,
        'senderMobile': this.sendAddress['mobile'],
        'senderTel': null,
        'senderProvince': this.sendAddress['province'],
        'senderCity': this.sendAddress['city'],
        'senderCounty': this.sendAddress['county'],
        'senderTown': this.sendAddress['town'],
        'senderLocation': this.sendAddress['address'],
        'senderAddress': this.sendAddress['province'] + this.sendAddress['city'] + this.sendAddress['county'] + (this.sendAddress['town'] ? this.sendAddress['town'] : '') + this.sendAddress['address'],
        'warehouseCode': null,
        'receiver': this.receiveAddres['contact'],
        'receiveCompany': null,
        'receiverMobile': this.receiveAddres['mobile'],
        'receiveTel': null,
        'receiveProvince': this.receiveAddres['province'],
        'receiveCity': this.receiveAddres['city'],
        'receiveTown': this.receiveAddres['town'],
        'receiveCounty': this.receiveAddres['county'],
        'receiveLocation': this.receiveAddres['address'],
        'receiveAddress': this.receiveAddres['province'] + this.receiveAddres['city'] + this.receiveAddres['county'] + (this.receiveAddres['town'] ? this.receiveAddres['town'] : '') + this.receiveAddres['address'],
        'packageCount': 1, // 包裹数量
        'payType': true,
        'promiseTimeType': true,
        'itemName': this.shopName,
        'goodsCount': null,
        'vloumLong': null,
        'vloumWidth': null,
        'vloumHeight': null,
        'weight': this.wight,
        'baoxian': true,
        'billRemark': null,
        'insuredValue': false,
        'insured': null,
        'collectionValue': false,
        'collectionMoney': null,
        'tempReceiveAddress': this.receiveAddres['province'] + this.receiveAddres['city'] + this.receiveAddres['county'] + this.receiveAddres['address'] + this.receiveAddres['contact'] + this.receiveAddres['mobile'],
        'tempSendAddress': this.sendAddress['province'] + this.sendAddress['city'] + this.sendAddress['county'] + this.sendAddress['address'] + this.sendAddress['contact'] + this.sendAddress['mobile'],
        'customerFreight': this.myPrice,
        'customerFreightType': this.channel,
        'linkName': 'yywl-袁宇进'
      }
      this.$post('/jdserver2/addBill', order).then((res) => {
        this.show = true
        let re = res['result']
        if (re) {
          let waybill = re['waybill'] // 物流单号
          console.log(waybill)
        }
      })
    }
  },
  watch: {

  }
}
</script>

<style scoped>
  #app {
    background-color: #efeff4;
    height: 750px;
  }
  .title {
    height: 3rem;
    line-height: 3rem;
    color: white;
    background-color: #317ee7;
    margin-bottom: 10px;
    text-align: center;
  }
  .card {
    background-color: white;
    border-radius: 0.275rem;
    padding: 10px;
    margin: 0 10px;

  }
   .address_box {
   }
   .send,
   .receive {
     margin-bottom: 15px;
     overflow: hidden;
     padding: 10px 0;
     border-bottom: 0px solid #ccc;
     white-space: pre-wrap;
   }
   .send img,
   .receive img {
    float: left;
    width: 25px;
  }
  .send_address,
  .receive_address {
    float: left;
    display: inline-block;
    width: 20rem;
    margin-left: 1rem;
  }
  .shopInfo {
    margin: 10px 10px;
  }
  .shopInfo input {
    border: 0;
    outline: none;
    height: 2rem;
    margin-top: 1rem;
  }
  .bottom {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 4rem;
    background-color: white;

  }
  .price {
    margin-top: 0.5rem;
    float: left;
    white-space: pre-wrap;
    margin-left: 1rem;
    font-size: 0.8rem;
  }
  .price span {
    float: left;
    margin-left: 0.278rem;
  }
  .max_price {
    float: left;
    font-size: 2rem;
    color: red;
    font-weight: 500;
  }
  .my_price_box {
    overflow: hidden;
    margin-top: 1rem;
  }
  .my_price_box input {
    float: left;
    margin-top: -.2rem;
    margin-right: 0.5rem;
  }
  .my_price_box span {
    float: left;
    margin-right: 0.5rem;
  }
  .createOrder {
    float: right;
    background-color: #317ee7;
    min-width: 7rem;
    height: 3rem;
    line-height: 3rem;
    border-radius: 0.1875rem;
    margin-right: .625rem;
    color: white;
    text-align: center;
    margin-top: 0.5rem;
  }
  .createOrderEnable {
     background-color: #cccccc;
  }
</style>
