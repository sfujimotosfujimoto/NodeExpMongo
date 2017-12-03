if (process.env.NODE_ENV === 'production') {
  module.exports = {mongoURI: 'mongodb://sf:sfujimoto@ds127436.mlab.com:27436/school-prod'}
  
} else  {
  module.exports = {mongoURI: 'mongodb://localhost/school-dev'}
}


