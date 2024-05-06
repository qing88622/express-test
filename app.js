const fs = require('fs')

const port = 3000

const express = require('express')
const { allowedNodeEnvironmentFlags } = require('process')

const app = express()

//將Express應用程式設置為使用內建的JSON中介軟體，以便解析傳入請求中的JSON主體。
//當在Express路由中處理POST、PUT或PATCH請求時，可以方便地存取和操作請求中的JSON資料。
app.use(express.json())

app.use((req,res,next)=>{
    console.log('hello middleware~')
    next()
})

app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString()
    next()
})

// readFileSync: 读取文件内容，并将内容以字符串的形式返回
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

const getAllTours = (req, res) => {
    console.log(req.requestTime)
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: tours,
    })
}

const getTour = (req, res) => {
    console.log(req.params)

    const id = req.params.id * 1 //轉字串
    const tour = tours.find(el => el.id === id)

    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: "invalid id"
        })
    }

    res.status(200).json({
        status: 'success',
        // results: tours.length,
        data: {
            tour: tour
        }
    })
}

const createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1
    const newTour = Object.assign({ id: newId }, req.body)
    tours.push(newTour)
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        console.error(err)
    })
    res.send('Done')
}

const updateTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        msg: `patch${req.params.id}`
    })
}

const deleteTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        msg: `delete${req.params.id}`
    })
}

// app.get('/api/v1/tours', getAllTours)
// app.get('/api/v1/tours/:id', getTour)
// app.post('/api/v1/tours', createTour)
// app.patch('/api/v1/tours/:id', updateTour)
// app.delete('/api/v1/tours/:id', deleteTour)

//優化寫法
app
    .route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour)

app
    .route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)   
    .delete(deleteTour)  

app.listen(port, () => {
    console.log(`App run on port ${port}`, (req, res) => {
        res.status(200).json({
            status: 'success',

        })
    })
})