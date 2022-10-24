const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json'
const endPointsFiles = ['./routes/articleRouter.js']
const docs = {
    info: {
        title: '10DaysProject API',
        description: "This is 10DaysProject API for our website Exam-Resource sharing Center.",
        version: "1.0.0"
    }
}
swaggerAutogen(outputFile, endPointsFiles, docs)


