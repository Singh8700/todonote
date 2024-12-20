// express module import
const express = require("express")
// express set in app variable
const app = express()

// ejs import
app.set("view engine","ejs")

// cookie-parser creaet
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))

// public folder like in this side
const path = require("path")
app.use(express.static(path.join(__dirname,"public")))


// file system module import
const fs = require("fs")


// app main interface
app.get("/",(req,res)=>{
    // file system module ko use karna hai file ko read karne ke liye "readdir" yani directre read karne ke liye
    fs.readdir(
        // isme pehle path aayega
        `./works`,
        // yec collback
        (error,files)=>{
            // console.log(files)
            res.render(
                "index",
                // kuch bhi yeha se bhejna ho to object ke roop me bhej sakte hai 
                {
                    files : files
                }
            )
        }
    )

})



// note delete karne ka code
app.get("/delete/:filename",(req,res)=>{
    console.log(req.path.split("delete/").join("works/"))
    fs.rm(req.path.split("/delete/").join("./works/"),(err, result)=>{
        console.log("error is ",err)
        res.redirect("/")
    })
})

// create route ke lie
app.post("/create",(req,res,next)=>{
  try{
    try {
  const stats = fs.statSync(`./works/${req.body.titles.split(' ').join('_')}.txt`);
  if(stats.isFile()){
    return res.render("alert")
    next()
  }
} catch (err) {
  //console.error(err);
}
    // console.log(req.body)
    fs.writeFile(`./works/${req.body.titles.split(' ').join('_')}.txt`,req.body.details,(err)=>{
        console.log("something  is wrong",err)
        return res.redirect('/')
    })
    
  } catch (e){
    console.log("create error",e)
  }
})


// create file ke data ko read karne ka code
app.get("/works/:filename",(req,res)=>{
    fs.readFile(`./works/${req.params.filename}`,"utf-8",(err, fileData)=>{
        console.log("somethin want worng",err)
        res.render("show",{
            fileTitle:req.params.filename,
            fileData: fileData
        })
    })
})

//file ke title ko change karne ka code
app.get("/edit/:filename",(req,res)=>{
  res.render("edit",{fileName : req.params.filename})
})

app.post("/edit",(req,res)=>{
  fs.rename(`./works/${req.body.previousTitle.split(" ").join("_")}.txt`,`./works/${req.body.newTitle.split(" ").join("_")}.txt`,(e)=>{
    res.redirect("/")
  })
// console.log("old file name",`./works/${req.body.previousTitle.split(" ").join("_")}.txt`)
// console.log("new file name",`./works/${req.body.newTitle.split(" ").join("_")}.txt`)
})


//update file content 
app.get("/update/:filename",(req,res)=>{
    //console.log("thus is one ",req.path.split("update/").join("works/"))
    try{
      const fileContet = fs.readFileSync(`./works${req.path.split("update/").join("")}`,"utf-8")
      //console.log(fileContetn)
res.render("update",{fileName :req.path.split("update/").join("works/"),
    content: fileContet
})
    }catch (e){
      console.log("fileContetn erro",e)
    }
})

app.post("/update",(req,res)=>{
  const fileName = `works/${req.body.previousTitle.split(" ").join("_")}.txt`
 // console.log(fileName)
  fs.writeFile(fileName,req.body.details,(e,data)=>{
    res.redirect(`/${fileName}`)
   // console.log("upadate ",fileName)
  })
})



// server link 
app.listen(3000,(req,res)=>{
    console.log("server is on")
})