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
const { log } = require("console")

// app main interface
app.get("/",(req,res)=>{
    // file system module ko use karna hai file ko read karne ke liye "readdir" yani directre read karne ke liye
    fs.readdir(
        // isme pehle path aayega
        `./files`,
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


// create route ke lie
app.post("/create",(req,res)=>{
    // console.log(req.body)
    fs.writeFile(`./works/${req.body.titles.split(' ').join('')}.txt`,req.body.details,(err)=>{
        console.log("something  is wrong",err)
        return res.redirect('/')
    })
})


// create file ke data ko read karne ka code
app.get("/works/:filename",(req,res)=>{
    fs.readFile(`./works/${req.params.filename}`,"utf-8",(err, fileData)=>{
        console.log("somethin want worng",err)
        res.render("show",{
            fileTitle:req.params.filename.split(".txt").join(""),
            fileData: fileData
        })
    })
})

// server link 
app.listen(3000,(req,res)=>{
    console.log("server is on")
})