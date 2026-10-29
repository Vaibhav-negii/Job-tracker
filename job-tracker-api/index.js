const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const app = express();
const AllowedStatus = [
    "wishlist" , "applied" ,"oa","interview","offer","rejected","ghosted"
]

app.use(cors());
app.use(express.json());

app.get('/api/application', async(req,res) =>{
    try{
        const statusFilter = req.query.status;
        const where ={};
        if(statusFilter !== undefined && statusFilter !==""){
            if(typeof statusFilter !=="string" || !AllowedStatus.includes(statusFilter)){
            return res.status(400).json({error :"Invalid status filter" });
            }
            where.status = statusFilter;
        
        }

        
    
        

    const applications = await prisma.application.findMany({
           where ,
           orderBy :{
            createdAt :"desc"
           }
    })
    return res.json(applications);
}catch(error){
    console.error("Error fetching application ",error);
 return res.status(500).json({error: "some error occured while fetching application"});


}
})

    
app.get('/api/application/:id',async (req,res)=>{
    try{
    const id = Number(req.params.id);
    if(!Number.isInteger(id)|| id<=0){
       return res.status(400).json({error: "Application id is invalid"});
    }
    
    const oneApplication = await prisma.application.findUnique(
        {
            where:{id}
        }
    )
    if(!oneApplication){
      return  res.status(404).json({error : "Application not found"});
    }
    return res.json(oneApplication);
}catch(error){
    console.error("Error while fetching Application",error);
    return res.status(500).json({error:"Something went wrong while fetching Application"});


}
})

app.post('/api/application', async(req,res) =>{
    try{
        const {company ,jobLink,location,role,source} = req.body?? {};
        const field = {company,jobLink,location,role,source};
        for(const [key,value] of Object.entries(field)){
            if(typeof value !=="string" ||value.trim() ===""){
                return res.status(400).json({error : `${key} is required`});
            }
        }
        const NewApplication = await  prisma.application.create({
            data : field
        })
        return res.status(201).json(NewApplication);
    }catch(error){
        console.error("Error creating application:",error);
        return res.status(500).json({error:"Something went wrong while creating application"});

    }

})


app.patch('/api/application/:id',async(req,res)=>{
    try{
    const {status ,notes}= req.body??{};
    const id = Number(req.params.id);

    if(!Number.isInteger(id) || id <=0){
        return res.status(400).json({error: " application id is invalid"});
    }
    if(status !==undefined && !AllowedStatus.includes(status)){
            return res.status(400).json({error :"invalid status given"});
        }
    
    if(status ===undefined && notes ===undefined){
        return res.status(400).json({error:"no value to update"})
    }
    if(notes !== undefined && typeof notes !=="string" && notes !== null ){
        return res.status(400).json({error :"Note must be a string"})
    }
    
    
    const updatedApplication = await prisma.application.update({
        where :{id},
      data: {status ,notes}
        
    })

    return res.status(200).json(updatedApplication);
}catch(error){
    if(error.code==="P2025"){
        return res.status(404).json("Application not found");
    
    }
    console.error("application cannot be updated",error);
    return res.status(500).json({error: "Something went wrong while updating application"});

}
})
app.delete('/api/application/:id', async (req, res) => {
    try{
         const id = Number(req.params.id);
        if(!Number.isInteger(id) || id <=0){
            return res.status(400).json({error:"Application id is invalid"});
        }
    
    await prisma.application.delete({
        where: { id: id }
    })
    return res.json({ message: "Application deleted" });
}catch(error){
    if(error.code ==="P2025"){
        return res.status(404).json({error:"Application not found"});
    }
    console.error("error occured while deleting" ,error);
    return res.status(500).json({error :"Something went wrong while deleting"});

}
})

app.listen(5000, () => {
    console.log("running on http://localhost:5000");
})