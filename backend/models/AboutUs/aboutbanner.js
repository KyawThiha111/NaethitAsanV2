import { Schema, model} from "mongoose";
import mongoose from "mongoose";
import path from "path"
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const defaultphotopath = "/public/Aboutus/healthcare.png"
//The document with default data will be created when you signup.
const aboutusBannerSchema = new Schema({
    titleen:{
        type:String,
        required:true,
        default:"About Us"
    },
    titlemy:{
        type:String,
        required:true,
        default:"ကျွန်ုပ်တို့အကြောင်း"
    },
    abouten:{
        type:String,
        default:"Learn about our mission, values, and the team dedicated to creating positive change."
    },
    aboutmy:{
        type:String,
        default:"ကျွန်ုပ်တို့၏ မစ်ရှင်၊ တန်ဖိုးများနှင့် အပြောင်းအလဲကောင်းများ ဖန်တီးရန် အတူတကွ ကြိုးပမ်းနေသောအဖွဲ့အား သိရှိပါ။"
    },
    bannerbgimg:{
        type:String,
        required:false,
    },
    blogtitleen:{
        type:String,
        required:true,
        default:"Background"
    },
    blogtitlemy:{
        type:String,
        required:true,
        default:"ကျွန်ုပ်တို့၏ပုံပြင်"
    },
    blogen:{
        type:String,
        required:true,
        default:"Founded in 2010, Charities began as a small community initiative in response to local needs. What started as a neighborhood food drive has grown into a nationally recognized nonprofit organization serving over 500,000 people annually.Our journey has been marked by the collective effort of thousands of volunteers, donors, and community partners who believe in our vision of a more equitable society. Each year, we expand our programs based on community needs and impact assessments.Today, we operate in 12 states with 35 dedicated staff members and a network of 1,200+ volunteers. Our financials are publicly available, with 87% of every dollar going directly to program services."
    },
    blogmy:{
        type:String,
        required:true,
        default:"Charities သည် ၂၀၁၀ ခုနှစ်တွင် ဒေသခံလိုအပ်ချက်များအတွက် တုံ့ပြန်ဆောင်ရွက်သော လူထုအခြေပြုအစီအစဉ်ငယ်တစ်ခုအဖြစ် စတင်ခဲ့သည်။ မူလတွင် ရပ်ကွက်အတွင်း အစားအစာစုဆောင်းမှုအဖြစ်စတင်ခဲ့သောအရာက ယနေ့တွင် နှစ်စဉ် ၅ သိန်းကျော်ကို အသင်းအဖွဲ့အဖြစ် ဝန်ဆောင်မှုပေးသော အမျိုးသားအဆင့် မှတ်ပုံတင်လူမှုအဖွဲ့အစည်းတစ်ခုအဖြစ် တိုးတက်လာခဲ့သည်။ကျွန်ုပ်တို့၏ ခရီးစဉ်သည် တူညီသောအမြင်ကို မျှဝေသော သံvolunteers များ၊ လှူဒါန်းသူများနှင့် လူထုပူးပေါင်းသူများ ထောင်ချီသော ပူးပေါင်းဆောင်ရွက်မှုဖြင့် အမှတ်တရဖြစ်နေသည်။ လူထုလိုအပ်ချက်နှင့် သက်ရောက်မှုအကဲဖြတ်ချက်များအပေါ်အခြေခံ၍ နှစ်စဉ်အစီအစဉ်အသစ်များကို တိုးချဲ့ဆောင်ရွက်နေပါသည်။ယနေ့တွင် ကျွန်ုပ်တို့သည် ပြည်နယ် ၁၂ ခုတွင် ဝန်ထမ်း ၃၅ ဦးနှင့် ကိုယ်ပိုင်စိတ်အားထက်သန်သော စေတနာ့ဝန်ထမ်း ၁,၂၀၀ ကျော်ရှိသည့်ကွန်ယက်ဖြင့် လည်ပတ်ဆောင်ရွက်နေပါသည်။ ကျွန်ုပ်တို့၏ ဘဏ္ဍာရေးအချက်အလက်များမှာ အများပြည်သူကြည့်ရှုနိုင်ပြီး တစ်ဒေါ်လာချင်းတိုင်းမှ ၈၇ ရာခိုင်နှုန်းကို အစီအစဉ်ဝန်ဆောင်မှုများတွင် တိုက်ရိုက်အသုံးပြုပါသည်။"
    },
    backgroundblogimg:{
        type:String,
        required:false,
    },
    homepageblogtitle_en:{
        type:String,
        required:true,
        default:"A Reason To Smile"
    },
    homepageblogtitle_my:{
        type:String,
        required:true,
        default:"ပြုံးရွှင်ဖွယ်အကြောင်းတစ်ခု"
    },
    homepageblog_en:{
        type:String,
        required:true,
        default:"In a world where most of non-profits focus solely on service, our social enterprise model inspires a new way forward: financialy viable, smartly funded, and diverstiified for lasting impact. We believe that substainable success not only changes lives but also builds a future where every smile counts. Join us in redefining change- because when passion is backed by sound business strategy, every step toward progress is a reason to smile."
    },
    homepageblog_my:{
        type:String,
        required:true,
        default:'အများစုသော အကျိုးအမြတ်မယူသော အဖွဲ့အစည်းများက ဝန်ဆောင်မှုတစ်ခုတည်းကိုသာ အာရုံစိုက်နေကြသည့် ဤကမ္ဘာတွင်၊ ကျွန်ုပ်တို့၏ လူမှုစီးပွားလုပ်ငန်း ပုံစံသည် ဘဏ္ဍာရေးအရ တည်တံ့ခိုင်မြဲပြီး ဉာဏ်ပညာဖြင့် ရန်ပုံငွေရှာကာ မျိုးစုံဖွံ့ဖြိုးသော ရေရှည်သက်ရောက်မှုရှိသည့် လမ်းကြောင်းသစ်တစ်ခုကို ညွှန်ပြနေပါသည်။တည်တံ့ခိုင်မြဲသော အောင်မြင်မှုသည် လူတို့၏ဘဝများကို ပြောင်းလဲစေရုံသာမက၊ ပြုံးရွှင်မှုတိုင်း အရေးပါသည့် အနာဂတ်တစ်ခုကိုလည်း တည်ဆောက်ပေးသည်ဟု ကျွန်ုပ်တို့ယုံကြည်ပါသည်။စိတ်အားထက်သန်မှုကို ကောင်းမွန်သော စီးပွားရေးဗျူဟာများက အားဖြည့်ပေးသည့်အခါ၊ တိုးတက်မှုဆီသို့ လှမ်းသည့် ခြေလှမ်းတိုင်းသည် ပြုံးစရာအကြောင်းတစ်ခု ဖြစ်လာပါသည်။ ပြောင်းလဲမှုကို အဓိပ္ပါယ်သစ်ဖြင့် သတ်မှတ်ရန် ကျွန်ုပ်တို့နှင့်အတူ ပါဝင်လိုက်ပါ။"'
    },
    homepageblogimg:{
    type:String,
    required:false,
    },
    introductionen:{
        type:String,
        required:true,
        default:"Earthquakes occur when underground rock suddenly breaks along a fault. This sudden release of energy causes seismic waves, making the ground shake.While some earthquakes are mild, others can be devastating, destroying buildings, roads, and even reshaping landscapes.Throughout history,earthquakes have left deep scars, but they have also taught us resilience and innovation.Modern engineering, early warning systems, and community education efforts have all been driven by the lessons learned from past quakes.Even though we cannot prevent earthquakes, understanding them allows us to minimize risks and protect lives.In every tremor, we are reminded that while nature's power is great, human courage and unity are greater."
    },
    introductionmy:{
        type:String,
        required:true,
        default:"မြေငလျင်သည် မြေအောက်တွင် ရာသီမညီညွတ်သည့် ကျောက်ဆောင်တစ်ခုသည် မကွဲမချိုးဖြစ်သွားသောအခါ ဖြစ်ပေါ်လာသည်။ထိုစွမ်းအင်အား ပြင်းထန်စွာ လွှတ်ပစ်ခြင်းကြောင့် မြေပြင်ကို တုပ်ကွေးစေသည့် ရေမြောင်းလှိုင်းများ (seismic waves) ဖြစ်ပေါ်စေသည်။မြေငလျင်တချို့သည် သာမာန်တုပ်ကွေးမှုသာဖြစ်သော်လည်း တချို့မှာ အဆောက်အအုံများ၊ လမ်းများကို ဖျက်စီးပြီး ပတ်ဝန်းကျင်ပုံသွင်းပုံကိုပါ ပြောင်းလဲစေနိုင်သည်။သမိုင်းတလျှောက် မြေငလျင်များက များပြားစွာသော ထိခိုက်မှုများဖြစ်စေခဲ့သော်လည်း လူ့အသိုင်းအဝိုင်းကို ခိုင်မာမှုနှင့် တီထွင်မှုများတွင် ပိုမိုတိုးတက်လာစေခဲ့သည်။ယနေ့ခေတ်တွင် နည်းပညာမြင့်မားသည့် အဆောက်အအုံများ၊ မြေငလျင် သတိပေးစနစ်များ နှင့် လူထုသင်ကြားရေးလုပ်ငန်းများသည် မြေငလျင်မှတ်တမ်းများမှ သင်ခန်းစာအရ တိုးတက်လာခဲ့ခြင်းဖြစ်သည်။မြေငလျင်ကို တားဆီးနိုင်မည် မဟုတ်သော်လည်း ၎င်းကို နားလည်ခြင်းဖြင့် အန္တရာယ်ကို လျော့နည်းစေနိုင်ပြီး အသက်များကို ကယ်တင်နိုင်သည်။မြေတုပ်ကွေးမှုတိုင်းအတွင်း သဘာဝ၏ စွမ်းအားသည် ကြီးမားသော်လည်း လူ့စွမ်းအားနှင့် ပူးပေါင်းဆောင်ရွက်မှုသည် ပိုမိုကြီးမြတ်ကြောင်း သတိပေးနေသည်။"
    },
    admins:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"admin",
            required:true,
           }
    ] 
},{timestamps:true})

const AboutUsBannerCollection = model("aboutusbanner",aboutusBannerSchema)
export default AboutUsBannerCollection;