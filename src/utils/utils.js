const fs = require('fs')

const response = require('../constant/response')


const imageUpload = async(file,dirName,prefix,res) => {
    if(file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){
        const generateName = generateNumber(10)

        const imageName = `${prefix}-${generateName}` + '.png'
        
        if(!fs.existsSync(dirName)){
            fs.mkdirSync(dirName, { recursive: true})
        }
        const promise = await new Promise(function(resolve, reject){
            file.mv(`${dirName}/` + imageName, async function(err){
                if(err){
                    console.log(err);
                    reject(err)
                }else{
                    resolve(null)
                }
            })
        })
        

        return { response: promise, image: imageName }
    }else{
        return response(res, false, 415, 'Invalid image type')
    }
}

const generateNumber = length => {
    let result = ''
    const characters = '0123456789'
    const charactersLength = characters.length
    for(let i = 0; i<length; i++){
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

module.exports = { imageUpload,generateNumber }