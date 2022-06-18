var express = require('express');
const axios = require('axios');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

async function fetchAccessToken() {
  const reqbody = {
    "grant_type":"client_credentials",
    "client_id":"0f08d737544fb7b08478d9e66fb5fa2ce2884763cb3288598dc7281350b8a57a",
    "client_secret":"d54974d2a679b008963f30081fa314d3d9934d747313de012f0b4073d5f9f2b2"
  }
  //@ts-ignore
  const response = await axios.post(`https://gslab27-dev.onelogin.com/auth/oauth2/v2/token`, 
  reqbody,
  {
    headers: {
        "Content-Type": "application/json",
    },

}  
).then((result)=>{
  return {data:result.data};
}).catch((e) =>{
console.log(e);
return {status:e.response.status, data:e.response.data};
})  
console.log("responsee", response.data.access_token);
return response.data.access_token;
}

async function setPassword( password, password_confirmation, id) {
  console.log("setpassword called");
  const reqbody = {
    "password":password,
    "password_confirmation":password_confirmation,
    "validate_policy": false,
        }
  const response = await axios.put(`https://api.us.onelogin.com/api/1/users/set_password_clear_text/${id}`,
      reqbody,
      {
          headers: {
              "Authorization":"Bearer 2f6cfa08d749c1e458d9b1b439e229a265f26e6b28a922f03b9a6d520f011f79",
              "Content-Type": "application/json"
          },

      }
      )
      .then((result)=>{
          return {data:result.data};
      }).catch((e) =>{
        console.log(e);
        return {status:e.response.status, data:e.response.data};
      })  
      
      return response;
}

const emailVerificationHTML = (link) => {
  return `<div style='background-color:#eee;width:100%;height:600px;display:flex;align-items:center;justify-content:center;box-sizing:border-box'> 
<div style='background-color:#fff;margin:20px auto;width:500px;height:500px;box-sizing:border-box;padding:20px'>
  <div>
    <span style="display:block;color:blue;border-bottom:1px solid #ccc;padding-bottom:10px;font-weight:bold;letter-spacing:0.5px;font-size:18px"> GSLAB </span>
     
    <div style="margin-top:15px">
      
      Hello, <br><br>
      We've received a request to reset the password for the <span style="font-weight:bold"> GSLAB </span> account associated with mail. No changes have been made to your account yet 
      <br>
      <br>
      You can reset your password by clicking the link below: 
       <br>
      <br>
      <a href="${link}" style="text-decoration:none; display:block; text-align:center; padding:10px;background-color:blue;color:#fff;font-weight:bold;border-radius:5px"> Reset your password</a>
      <br> 
      It you did not request a new password, please let us know immediately by replying to this email. 
      <br><br>
      You can find answers to most questions and get in touch with us at <span style="font-weight:bold;text-decoration:underline">support@gslab.com</span>. We're here to help you at any step along the way. 
      <br> <br>
      
      ---- GSLAB team
    </div>
    
  </div>
</div>
</div>`
}

router.post('/register', async function(req, res){
  const token = await fetchAccessToken();
  console.log("registerdata UI", req.body);
  const response = await axios.post("https://api.us.onelogin.com/api/1/users",
        req.body,
        {
            headers: {
                "Authorization":`Bearer ${token} `,
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers":
                "x-access-token, Origin, X-Requested-With, Content-Type, Accept",
            },

        }
        ).then( async (result)=>{
          const id = result.data.data[0].id
        
        // const responsepass = await setPassword(
        //   "user@1234",
        //   "user@1234",
        //   id,
        // )
        
        // console.log("Response******************", responsepass.then((result) =>{
        //   console.log("Rahul",result);
        // })
        // );
            console.log("response++++++",result);
            return result;
        }).catch((e) =>{
          console.log(e);
          return {status:e.response.status, data:e.response.data};
        })
        res.status(response.status).send(response.data)

})

router.post('/login', async function(req, res){
  const token = await fetchAccessToken();
  console.log("reqbody ui", req.body.username);
  const reqData = {
    "username_or_email": req.body.username,
    "password": req.body.password,
    "subdomain": "gslab27-dev"
}
    const response = await axios.post("https://api.us.onelogin.com/api/1/login/auth",
    reqData,
          {
              headers: {
                  "Authorization":`Bearer ${token}`,
                  "Content-Type": "application/json"
              },
  
          }
          ).then((result)=>{
              return {data:result.data.data[0]};
          }).catch((e) =>{
            console.log(e);
            return {status:e.response.status, data:e.response.data};
          })
          res.status(200).send(response.data)
  
  })


  

    
      router.get('/auth-factors/:id', async function(req, res){
        var id = req.params.id;
        console.log("authfactors************");
        const token = await fetchAccessToken();
        const response = await axios.get(`https://api.us.onelogin.com/api/2/mfa/users/${id}/factors`,
              {
                  headers: {
                      "Authorization":`Bearer ${token} `,
                      
                  },
      
              }
              ).then((result)=>{
                console.log("Result**",result);
                return result;
              })
              .catch((e) =>{
                console.log(e);
                return {status:e.response.status, data:e.response.data};
              })
              console.log("response**", response.data);
              res.status(response.status).send(response.data)
      
      })

      router.get('/enrolled-factors/:id', async function(req, res){
        var id = req.params.id;
        console.log("**authfactors**", id);
        const token = await fetchAccessToken();
        const response = await axios.get(`https://api.us.onelogin.com/api/2/mfa/users/${id}/devices`,
              {
                  headers: {
                      "Authorization":`Bearer ${token} `,
                      
                  },
      
              }
              ).then((result)=>{
                console.log("Result**",result);
                return result;
              })
              .catch((e) =>{
                console.log(e);
                return {status:e.response.status, data:e.response.data};
              })
              console.log("response**", response.data);
              res.status(response.status).send(response.data)
      
      })

      router.post('/register-mfa/:id', async function(req, res){
        var id = req.params.id;
        const token = await fetchAccessToken();
        console.log("request body", req.body);
        // const reqBody = {
        //   "factor_id" : req.body.factor_id,
        //   "verified":true
        // }
          const response = await axios.post(`https://api.us.onelogin.com/api/2/mfa/users/${id}/registrations`,
          req.body,
                {
                    headers: {
                        "Authorization":`Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
        
                }
                ).then((result)=>{
                    return result;
                }).catch((e) =>{
                  console.log(e);
                  return {status:e.response.status, data:e.response.data};
                })
                res.status(response.status).send(response.data)
        
        })

        router.put('/verify-mfa/:id/:registrationId', async function(req, res){
          var id = req.params.id;
          var registrationId = req.params.registrationId;
          const token = await fetchAccessToken();
          console.log("request body", req.body);
            const response = await axios.put(`https://api.us.onelogin.com/api/2/mfa/users/${id}/registrations/${registrationId}`,
                  req.body,
                  {
                      headers: {
                          "Authorization":`Bearer ${token}`,
                          "Content-Type": "application/json",
                      },
          
                  }
                  ).then((result)=>{
                      return result;
                  }).catch((e) =>{
                    console.log(e);
                    return {status:e.response.status, data:e.response.data};
                  })
                  res.status(response.status).send(response.data)
          
          })

      router.post('/verifyMfa', async function(req, res){
        const token = await fetchAccessToken();
        console.log("verifytoken body", req.body);
          const response = await axios.post(`https://api.us.onelogin.com/api/1/login/verify_factor`,
                req.body,
                {
                    headers: {
                        "Authorization":`Bearer ${token}`,
                    },
                }
                ).then((data)=>{
                    console.log("MFA***",data);
                    return data;
                }).catch((e) =>{
                  console.log("erro**",e);
                  return {status:e.response.status, data:e.response.data};
                })
                res.status(response.status).send(response.data)
        
        })

        router.post('/send-email', async function(req, res){
          // console.log("send email inputUI", req);
          // const emailadd = req;
          // const token = await fetchAccessToken();
          // console.log("verifytoken body", req.body);
          const link = 'http://localhost:3000/resetPassword'
          const mailContent = emailVerificationHTML(link);
            const response = await axios.post(`https://api.sendgrid.com/v3/mail/send`,
                  {
                    personalizations: [
                      {
                        to: [{ email: 'pooja.bhosale@gslab.com', name: 'Pooja' }],
                        subject: 'Mail Verification',
                      },
                    ],
                    content: [{ type: 'text/html', value: mailContent }],
                    from: { email: 'noreplysgsl@gmail.com', name: 'Pranali' },
                  },
                  {
                      headers: {
                          "Authorization":`Bearer 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`,
                          'Accept': 'application/json',
                          'Content-Type': 'application/json',
                      },
                  }
                  ).then((data)=>{
                      console.log("Email sendgrid",data);
                      return data;
                  }).catch((e) =>{
                    console.log("erro**",e);
                    return {status:e.response.status, data:e.response.data};
                  })
                  res.status(response.status).send(response.data)
          
          })
          router.put('/update/:id', async function(req, res){
            const token = await fetchAccessToken();
            var id = req.params.id;
            console.log("request ui",id);
              const response = await axios.put(`https://api.us.onelogin.com/api/1/users/${id}`,
                    req.body,
                    {
                        headers: {
                            "Authorization":`Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                    ).then((data)=>{
                        console.log("response++++++",data);
                        return data;
                    }).catch((e) =>{
                      console.log(e);
                      return {status:e.response.status, data:e.response.data};
                    })
                    res.status(response.status).send(response.data)
            
            })
      
            router.post('/send-invite', async function(req, res){
              const token = await fetchAccessToken();
              console.log("request ui",req.body);
                const response = await axios.post(`https://api.us.onelogin.com/api/1/invites/send_invite_link`,
                      req.body,
                      {
                          headers: {
                              "Authorization":`Bearer ${token}`,
                              "Content-Type": "application/json",
                          },
                      }
                      ).then((data)=>{
                          console.log("response++++++",data);
                          return data;
                      }).catch((e) =>{
                        console.log(e);
                        return {status:e.response.status, data:e.response.data};
                      })
                      res.status(response.status).send(response.data)
              
              })

          router.put('/setPassword', async function(req, res){
            console.log("setPassword input", req.body);
            const token = await fetchAccessToken();
            const response = await axios.put(`https://api.us.onelogin.com/api/1/users/set_password_clear_text/177339697`,
                req.body,
                {
                    headers: {
                        "Authorization":`Bearer ${token}`,
                        "Content-Type": "application/json"
                    },

                }
                )
                .then((result)=>{
                  console.log("successabcd", result);
                    return result;
                }).catch((e) =>{
                  console.log(e);
                  return {status:e.response.status, data:e.response.data};
                })  
                console.log("responseabcd", response);
                res.status(response.status).send(response.data);
            })

  
  
module.exports = router;
