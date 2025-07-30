const cv=require("mongoose");
const model=cv.Schema({
    id:{
        type: String,
    },
    userid:{
        type: String,
    },
    title:{
        type:String,
    },
    body:{
        type:String,
    }

});
module.exports=cv.model("Bilal",model);