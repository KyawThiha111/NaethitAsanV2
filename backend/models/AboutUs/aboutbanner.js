import { Schema, model} from "mongoose";
import mongoose from "mongoose";
//The document with default data will be created when you signup.
const aboutusBannerSchema = new Schema({
    headeren:{
        type:String,
        required:true,
        default:"About Us"
    },
    headermy:{
        type:String,
        required:true,
        default:"ကျွန်ုပ်တို့အကြောင်း"
    },
    descriptionen:{
        type:String,
        default:"Learn about our mission, values, and the team dedicated to creating positive change."
    },
    descriptionmy:{
        type:String,
        default:"ကျွန်ုပ်တို့၏ မစ်ရှင်၊ တန်ဖိုးများနှင့် အပြောင်းအလဲကောင်းများ ဖန်တီးရန် အတူတကွ ကြိုးပမ်းနေသောအဖွဲ့အား သိရှိပါ။"
    },
    bannerbgPhoto:{
        type:String,
        required:false
    },
    storytitleen:{
        type:String,
        required:true,
        default:"Our Story"
    },
    stroytitlemy:{
        type:String,
        required:true,
        default:"ကျွန်ုပ်တို့၏ပုံပြင်"
    },
    storyblogen:{
        type:String,
        required:true,
        default:"Founded in 2010, Charities began as a small community initiative in response to local needs. What started as a neighborhood food drive has grown into a nationally recognized nonprofit organization serving over 500,000 people annually.Our journey has been marked by the collective effort of thousands of volunteers, donors, and community partners who believe in our vision of a more equitable society. Each year, we expand our programs based on community needs and impact assessments.Today, we operate in 12 states with 35 dedicated staff members and a network of 1,200+ volunteers. Our financials are publicly available, with 87% of every dollar going directly to program services."
    },
    storyblogmy:{
        type:String,
        required:true,
        default:"Charities သည် ၂၀၁၀ ခုနှစ်တွင် ဒေသခံလိုအပ်ချက်များအတွက် တုံ့ပြန်ဆောင်ရွက်သော လူထုအခြေပြုအစီအစဉ်ငယ်တစ်ခုအဖြစ် စတင်ခဲ့သည်။ မူလတွင် ရပ်ကွက်အတွင်း အစားအစာစုဆောင်းမှုအဖြစ်စတင်ခဲ့သောအရာက ယနေ့တွင် နှစ်စဉ် ၅ သိန်းကျော်ကို အသင်းအဖွဲ့အဖြစ် ဝန်ဆောင်မှုပေးသော အမျိုးသားအဆင့် မှတ်ပုံတင်လူမှုအဖွဲ့အစည်းတစ်ခုအဖြစ် တိုးတက်လာခဲ့သည်။ကျွန်ုပ်တို့၏ ခရီးစဉ်သည် တူညီသောအမြင်ကို မျှဝေသော သံvolunteers များ၊ လှူဒါန်းသူများနှင့် လူထုပူးပေါင်းသူများ ထောင်ချီသော ပူးပေါင်းဆောင်ရွက်မှုဖြင့် အမှတ်တရဖြစ်နေသည်။ လူထုလိုအပ်ချက်နှင့် သက်ရောက်မှုအကဲဖြတ်ချက်များအပေါ်အခြေခံ၍ နှစ်စဉ်အစီအစဉ်အသစ်များကို တိုးချဲ့ဆောင်ရွက်နေပါသည်။ယနေ့တွင် ကျွန်ုပ်တို့သည် ပြည်နယ် ၁၂ ခုတွင် ဝန်ထမ်း ၃၅ ဦးနှင့် ကိုယ်ပိုင်စိတ်အားထက်သန်သော စေတနာ့ဝန်ထမ်း ၁,၂၀၀ ကျော်ရှိသည့်ကွန်ယက်ဖြင့် လည်ပတ်ဆောင်ရွက်နေပါသည်။ ကျွန်ုပ်တို့၏ ဘဏ္ဍာရေးအချက်အလက်များမှာ အများပြည်သူကြည့်ရှုနိုင်ပြီး တစ်ဒေါ်လာချင်းတိုင်းမှ ၈၇ ရာခိုင်နှုန်းကို အစီအစဉ်ဝန်ဆောင်မှုများတွင် တိုက်ရိုက်အသုံးပြုပါသည်။"
    },
    visionemoji:{
        type:String,
        required:true,
        default:"🌍"
    },
    visiontitleen:{
        type:String,
        required:true,
        default:"Our vision"
    },
    visiontitlemy:{
        type:String,
        required:true,
        default:"ကျွန်ုပ်တို့၏ ရှုမှန်ချက်"
    },
    visionen:{
        type:String,
        required:true,
        default:"A world where every individual has access to basic needs, opportunities for growth, and the support of a caring community—regardless of their circumstances."
    },
    visionmy:{
        type:String,
        required:true,
        default:"လူတိုင်းအတွက် အခြေခံလိုအပ်ချက်များ၊ တိုးတက်ဖွံ့ဖြိုးရန်အခွင့်အလမ်းများ၊ နှင့် ကြင်နာစောင့်ရှောက်သော လူ့အသိုင်းအဝိုင်း၏ ထောက်ခံမှုတို့ကို လူရေးအခြေအနေမရွေး ရရှိနိုင်သော ကမ္ဘာတစ်ခု။"
    },
    missionemoji:{
        type:String,
        required:true,
        default:"🌍"
    },
    missiontitleen:{
      type:String,
      required:true,  
      default:"Our Mission"
    },
    missiontitlemy:{
      type:String,
      required:true,  
      default:"ကျွန်ုပ်တို့၏ မစ်ရှင်"
    },
    missionen:{
        type:String,
        required:true,
        default:"To empower underserved communities through sustainable programs in education, nutrition, and economic development while fostering a culture of service and philanthropy."
    },
    missionmy:{
        type:String,
        required:true,
        default:"ပညာရေး၊ အာဟာရနှင့် စီးပွားရေးဖွံ့ဖြိုးတိုးတက်မှုဆိုင်ရာ တည်တံ့သောအစီအစဉ်များမှတစ်ဆင့် အခက်အခဲကြုံတွေ့နေသည့် လူထုများအား စွမ်းအားတက်စေခြင်း၊ နှင့် ဝန်ဆောင်မှုဓလေ့နှင့် သံဃာတူဝှက်မှုအတွေးအခေါ်တစ်ရပ်ကို ဖော်ဆောင်သည့် ယဉ်ကျေးမှုတစ်ခုအား တည်ဆောက်ခြင်း။"
    },
    admin:{
        type:mongoose.Schema.Types.ObjectId,
         ref:"admin",
         required:true 
    }
},{timestamps:true})

const AboutUsBannerCollection = model("aboutusbanner",aboutusBannerSchema)
export default AboutUsBannerCollection;