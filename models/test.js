function test(matrix , price , count , cb){
    // path from ali
    let data = {
        rootpath : rootpath , 
        type : 'new',
        matrix : '9999'
    };
    data = JSON.stringify(data);
    let script = path.join(__dirname, '..', 'helpers', 'image-processing' , 'image_manipulate.py');
    let opt = {
        mode: 'text',
        pythonOptions: ['-u'],
        args: [data]
    };
    PythonShell.run(script, opt, (err , data)=>{
        if(data){
            console.log(data);
        }else{
            console.log(err);
        }
    });
}

