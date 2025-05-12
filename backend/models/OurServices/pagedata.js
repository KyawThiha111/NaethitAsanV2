import { Schema,model } from "mongoose";
import mongoose from "mongoose";

const ServicePageData = new Schema({
    header_en:{
        type:String,
        require:true,
        default:"Our Services"
    },
    header_my:{
        type:String,
        require:true,
        default:"ကျွန်ုပ်တို့၏ ဝန်ဆောင်မှုများ"
    },
    subheader_en:{
        type:String,
        require:true,
        default:"We are dedicated to making a positive impact in our community through various services."
    },
    subheader_my:{
        type:String,
        require:true,
        default:"အမျိုးမျိုးသော ဝန်ဆောင်မှုများအကြောင်းဖြင့် ကျွန်ုပ်တို့၏ လူမှုအသိုင်းအဝိုင်းအတွက် အကောင်းသက်ရောက်မှုရှိစေရန် ကြိုးပမ်းလျက်ရှိပါသည်။"
    },
    banner_bg_img:{
        type:String,
        required:false
    },
    blog1_en:{
        type:String,
        required:true,
        default:"While non-profits have long focused on primary healthcare (PHC), Myanmar’s evolving crisis has outpaced this model: Worsening economic inequality pushes more people into self-treatment via informal pharmacies, where unregistered, low-quality medications dominate. Decreased affordability of specialist visits has led to lower compliance and more complications."
    },
    blog1_my:{
        type:String,
        required:true,
        default:"လူမူအကျိုးပြုအဖွဲ့များသည် အခြေခံကျန်းမာရေးစောင့်ရှောက်မှု (PHC) ကို ဦးစားပေးလုပ်ဆောင်ခဲ့ခြင်းရှိသော်လည်း၊ မြန်မာနိုင်ငံတွင် အလယ်အလတ်အခက်အခဲများ ပိုမိုဆိုးရွားလာသည်နှင့်အမျှ ထိုမော်ဒယ်မျိုးသည် အလုံအလောက် မကိုပ်တည်းတော့ပါ။ စီးပွားရေးအမြဲတိုးလာသော မညီမျှမှုကြောင့် လူထုအများစုသည် လက်မှတ်မဲ့၊ အရည်အသွေးနိမ့်သောဆေးဝါးများသာ ရောင်းချသော အတည်မပြု သွားလမ်းဆေးဆိုင်ငယ်များကနေ ကိုယ့်ကိုယ်ကို ကုသခြင်းသို့ ရွေ့လျားသွားကြရသည်။ ထို့ပြင် အထူးကုဆေးရုံ/ဆရာဝန်များထံ သွားရောက်ကုသဖို့ ကုန်ကျစရိတ်က တက်လာတဲ့အတွက် သေချာသောက်သုံးလိုက်နာမှုများ လျော့နည်းကာ ရောဂါရှုပ်ထွေးမှုများ ပိုပေါ်ပေါက်လာသည်။"
    },
    blog1_img:{
        type:String,
        required:false,
    },
    blog2_en:{
        type:String,
        required:true,
        default:"High operational costs, limited access to affordable technologies, economic disparities among patients, systemic issues like inadequate healthcare funding, regulatory barriers, and workforce shortages."
    },
    blog2_my:{
        type:String,
        required:true,
        default:"လုပ်ငန်းဆောင်ရွက်မှုကုန်ကျစရိတ်မြင့်ခြင်း၊ ချိန်နိုင်သောနည်းပညာများကို အလွယ်တကူ မရရှိနိုင်ခြင်း၊ လူနာများအကြား စီးပွားရေးမညီမျှမှု၊ ကျန်းမာရေးအတွက် လုံလောက်သော ဘတ်ဂျက်မရှိခြင်းကဲ့သို့သော စနစ်ပိုင်းဆိုင်ရာပြဿနာများ၊ စည်းမျဉ်းထဲက အတားအဆီးများနှင့် ကျန်းမာရေးဝန်ထမ်းများ မလုံလောက်ခြင်းကဲ့သို့သော အခက်အခဲများ။"
    },
    blog2_img:{
        type:String,
        required:false
    },
     admins:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"admin",
                required:true,
               }
        ] 
},{timestamps:true})

const servicepageDataCollection = model("servicepagedata",ServicePageData);
export default servicepageDataCollection;