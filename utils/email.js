const { model } = require("mongoose");
const nodemailer=require("nodemailer");
const pug=require("pug");
const htmlToText=require("html-to-text");

module.exports=class Email{

  constructor(user,url){

    this.to=user.email,
    this.first_name=user.name.split(" ")[0],
    this.url=url,
    this.from=`Natours ${process.env.EMAIL_FROM}`
  }

  new_transport()
  {
    if(process.env.NODE_ENV=="production")
    {
      return nodemailer.createTransport({
        host:process.env.MAILER_EMAIL_HOST,
        
        port:process.env.MAILER_EMAIL_PORT,
        auth:{
          user:process.env.MAILER_EMAIL_USERNAME,
          pass:process.env.MAILER_EMAIL_PASSWORD,
        }
      })
    }
    
    return nodemailer.createTransport({
      host:process.env.MAILER_EMAIL_HOST,
      from:"trial-x2p0347jo2p4zdrn.mlsender.net",
      port:process.env.MAILER_EMAIL_PORT,
      auth:{
        user:process.env.MAILER_EMAIL_USERNAME,
        pass:process.env.MAILER_EMAIL_PASSWORD
      }
    })

    return nodemailer.createTransport({
      host:process.env.EMAIL_HOST,
      port:process.env.EMAIL_PORT,
      auth:{
        user:process.env.EMAIL_USERNAME,
        pass:process.env.EMAIL_PASSWORD
      }
    })
  }

  async send(template,subject)
  {
     const html=pug.renderFile(
        `${__dirname}/../views/email/${template}.pug`,
        {
          firstName:this.first_name,
          url:this.url,
          subject,
          email:"admin@natours.com"
        }
     );

     const mail_options={
        from:"natours@trial-x2p0347jo2p4zdrn.mlsender.net",
        to:this.to,
        subject,
        html,
        text:htmlToText.convert(html)
     };

     await this.new_transport().sendMail(mail_options);
  }

  async send_welcome()
  {
    await this.send("welcome","Welcome to Natours family");
  }

  async password_reset()
  {
    await this.send("passwordReset","Natours | Password reset email(Valid for 10 min)");
  }
}



