//chat app stuff

//declare library variable
const mongo = require('mongodb').MongoClient; 
const socketClient = require('socket.io').listen(4000).sockets;

//connect to mongodb
mongo.connect('mongodb+srv://yeet-webapp:hunnybee12@cluster0-tmpow.mongodb.net',{ useNewUrlParser: true }, function(err,client){
    
    let db = client.db('myChat');

    if(err){
        throw err;
    }
    console.log('MongoDB connected...');

    //connect to socket.io 
    socketClient.on('connection', function(socket){
        //console.log(db);
        let chat = db.collection('chats');
    
        //get chats from mongo collection
    chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
        if(err){
            throw err;
        }

        // Emit the messages
        //HANDLE IN JS
        socket.emit('output', res);
    });

    // Handle input events
    socket.on('input', function(data){
        let name = data.name;
        let message = data.message;

        // Check for name and message
        if(name == '' || message == ''){
            // Send error status
            console.log('Please enter a name and message');
        } 
        else {
            // Insert message into database
            //HANDLE IN JS
            chat.insertOne({name: name, message: message}, function(){
                socketClient.emit('output', [data]);
            });
        }
    });
    });
   
});