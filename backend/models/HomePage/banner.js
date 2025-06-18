/* 
1. homepage_banner_bg( File ) 
1. header_en
2. header_my
3. description_en
4. description_my
5. homepageblog_my
6. homepgaeblog_en
7. yos_en
8. yos_my
9. nop_en
10.nop_my
11.nom_en
12.nom_my
13.tps_en
14. tps_my
*/
import {Schema,model} from "mongoose"
import mongoose from "mongoose";

const BannerSchema = new Schema({
   homepage_banner_bg:{
    type:String,
    required:false
   },
   header_en:{
    type:String,
    required:true,
    default:"Providing Quality Healthcare with Affordable Solutions"
   },
   header_my:{
    type:String,
    required:true,
    default:"ဈေးနှုန်းသက်သာပြီး အရည်အသွေးပြည့်ဝတဲ့ ကျန်းမာရေးစောင့်ရှောက်မှုတွေကို ပေးစွမ်းနေပါတယ်။"
   },
   description_en:{
    type:String,
    required:true,
    default:"Nae Thit Kyan Mar (NTKM) is a pioneering healthcare social enterprise in Myanmar, committed to delivering affordable, comprehensive quality healthcare services through innovative solutions. With a strong focus on Liver Health (Hepatitis B & C, Fatty Liver), NCDs (Hypertension, Diabetes), and RMNCH (Reproductive, Maternal, Newborn, and Child Health), NTKM operates specialist clinics, retail pharmacies, and a molecular-grade medical laboratory. We aim to transform healthcare accessibility with digital integration and provide impactful solutions to the people of Myanmar."
   },
   description_my:{
    type:String,
    required:true,
    default:"NTKM တွင် အထူးကုဆေးခန်းများ၊ ဆေးဆိုင်များ နှင့် မော်လီကျူးအဆင့် ဆေးဘက်ဆိုင်ရာဓာတ်ခွဲခန်း တို့ဖြင့် ဝန်ဆောင်မှုပေးလျက်ရှိပါသည်။ ဒီဂျစ်တယ်နည်းပညာများ ပေါင်းစပ်ကာ မြန်မာပြည်သူများ ကျန်းမာရေးဝန်ဆောင်မှုများကို ပိုမိုလွယ်ကူစွာရရှိစေရန် ရည်မှန်းဆောင်ရွက်လျက်ရှိပါသည်။ ကျွန်ုပ်တို့၏ ရည်မှန်းချက်မှာ မြန်မာနိုင်ငံအတွက် ထိရောက်သော ကျန်းမာရေးဖြေရှင်းနည်းများကို ဖော်ဆောင်ရန်"
   },
   homepageblog_title_en:{
    type:String,
    required:true,
    default:"A Reason To Smile"
   },
   homepageblog_title_my:{
    type:String,
    required:true,
    default:"ကျန်းမာရေးကို အဓိကထား"
   },
   homepageblog_subtitle_en:{
    type:String,
    required:false
   },
   homepageblog_subtitle_my:{
    type:String,
   required:false
   },
   homepageblog_en:{
    type:String,
    required:true,
    default:"In a world where most of non-profits focus solely on service, our social enterprise model inspires a new way forward: financialy viable, smartly funded, and diverstiified for lasting impact. We believe that substainable success not only changes lives but also builds a future where every smile counts. Join us in redefining change- because when passion is backed by sound business strategy, every step toward progress is a reason to smile. "
   },
   homepageblog_my:{
    type:String,
    required:true,
    default:'၂၀၂၂ ခုနှစ်၊ စက်တင်ဘာလတွင် "နေသစ်ကုမ္ပဏီ လီမိတက် (By Guarantee)" ကို မြန်မာနိုင်ငံ၏ ကျန်းမာရေး၊ ပညာရေးနှင့် စီးပွားရေးကဏ္ဍများတွင် အပြုသဘော သက်ရောက်မှုများ ဖန်တီးရန် လူမှုစီးပွားလုပ်ငန်း (social enterprise) အဖြစ် တည်ထောင်ခဲ့ပါသည်။ "နေသစ်ကျန်းမာ" ဟူသော အမည်သည် "ကျန်းမာသော (Kyan Mar) နေ့သစ် (Nae Thit)" ဟု အဓိပ္ပာယ်ရပြီး၊ လူတိုင်းအတွက် ယခင်ကမခံစားဖူးသော ကျန်းမာရေးနှင့် စိတ်ချမှုကို ခံစားရင်း ပြုံးရွှင်စွာဖြင့် နေ့သစ်တစ်ခုကို စတင်နိုင်ကြမည်ဟူသော မျှော်လင့်ချက်ကို ရောင်ပြန်ဟပ်ပါသည်။ နေသစ်ကျန်းမာသည် အရည်အသွေးမြင့် ကျန်းမာရေးဝန်ဆောင်မှုများကို စျေးနှုန်းချိုသာစွာဖြင့် ဆန်းသစ်သောနည်းလမ်းများဖြင့် ရပ်ရွာလူထုအတွက် လိုအပ်ချက်များကို ဖြည့်ဆည်းပေးသော ဆေးခန်းများ၏ ကွန်ရက်တစ်ခုဖြစ်ပါသည်။ ကျွန်ုပ်တို့သည် မြို့ပြနှင့် မြို့ပြဆင်ခြေဖုံးဒေသများရှိ လူထုအား အရည်အသွေးမီ ကျန်းမာရေးဝန်ဆောင်မှုများကို စျေးနှုန်းသက်သာစွာဖြင့် ပေးစွမ်းလျက်ရှိပါသည်။နေသစ်ကျန်းမာ ဆေးခန်းများ၏ ရည်မှန်းချက်မှာ လူနာများအတွက်သာမက ရပ်ရွာလူထုအတွက်ပါ တန်ဖိုးရှိသော ဝန်ဆောင်မှုများကို ပေးစွမ်းကာ လူမှုဘဝများကို ပြောင်းလဲတိုးတက်စေရန်နှင့် ပိုမိုကောင်းမွန်သော လူမှုအကျိုးသက်ရောက်မှုများ ဖန်တီးရန်ဖြစ်ပါသည်။'
   },
   homepage_blog_img:{
  type:String,
  required:false
   },
   yos_en:{
    type:String,
    required:true,
    default:"4"
   },
   yos_my:{
    type:String,
    required:true,
    default:"၄"
   },
   nop_en:{
    type:String,
    required:true,
    default:"106,406"
   },
   nop_my:{
    type:String,
    required:true,
    default:"၁၀၆၄၀၆"
   },
   nom_en:{
    type:String,
    required:true,
    default:"48"
   },
   nom_my:{
    type:String,
    required:true,
    default:"၄၈"
   },
   tps_en:{
    type:String,
    required:true,
    default:"756,982"
   },
   tps_my:{
    type:String,
    required:true,
    default:"၇၅၆၉၈၂"
   },
   admins:[
        {
                type:mongoose.Schema.Types.ObjectId,
                ref:"admin",
                required:true,
               }
   ]
},{timestamps:true})

const HomepagebannerCollection = model("homepgaebanner",BannerSchema);
export default HomepagebannerCollection;