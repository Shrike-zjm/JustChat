import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes,Link,useNavigate } from "react-router-dom";
import Clipboard from "clipboard";

import LockOpenIcon from '@mui/icons-material/LockOpen';
import PersonIcon from '@mui/icons-material/Person';
import UndoIcon from '@mui/icons-material/Undo';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import ChatIcon from '@mui/icons-material/Chat';
import DoneIcon from '@mui/icons-material/Done';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';

const withRouter = (Component) => {//理解：闭包，返回一个用于接收参数的函数组件
  const Wrapper = (props) => {
    const navigate = useNavigate();
    
    return (
      <Component
        navigate={navigate}
        {...props}
        />
    );
  };
  
  return Wrapper;
};

function Sizedbox(props){
  return(
    <div style={{
      height:props.h,
      width:props.w
    }}></div>
  );
}

function IconButton(props){
  let navigate=useNavigate();
  var res=(
    <div className={props.needcopy?'icon_button needcopy':'icon_button'} 
      style={{
      // backgroundColor:"red",
      position: props.relative?"relative":"absolute",
      top:props.top,
      left:props.left,

      borderStyle:"groove",
      borderColor:"lightblue",
      borderWidth:3+"px",
      width:props.size+"px",
      height:props.size+"px",
      }}
      onClick={()=>{
        if(props.OnPressed){
          props.OnPressed();
        }
        if(props.route){
          navigate(props.route);
        }
      }}
      >
      <Sizedbox h={props.size/8}/>
      <div className='ibi'>{props.theIcon}</div>
      <p className='ibt wkf'>{props.text}</p>

    </div>
  );


  return(res);
}


class JustChatApp extends React.Component{
  
  constructor(props){
    super(props);
    //this.Jump=this.Jump.bind(this);
  }

  // Jump(router){
  //   this.props.history.push(router);
  // }

  render(){
    return(
      <BrowserRouter basename='/JustChat/build'>
      {/* <BrowserRouter> */}
        <Routes>
          <Route path='/' element={<HomePage/>} />
          <Route path='/SignIn' element={<SignInPage2/>} />
          <Route path='/Register' element={<RegisterPage2/>}/>
          <Route path='/UserConsole' element={<UserConsolePage2/>}/>
          <Route path='/UnansweredPage' element={<UnansweredPage2/>}/>
          <Route path='/QuestionDetail' element={<QuestionDetail/>}/>
          <Route path='/AnsweredPage' element={<AnsweredPage/>}/>
          
          <Route path='*' element={<NotFound/>}/>
        </Routes>
      </BrowserRouter>
    );
  }

}

class HomePage extends React.Component{

  constructor(props){
    super(props);
  }

  render(){
    return(
      <div className='homepage'>
        <p className='title1 engf'>Just Chat</p>
        <p className='title2 wkf'>(回答者入口)</p>
        {/* <LockOpenIcon/> */}
        <Link to="/SignIn" className="link">
          <IconButton theIcon={<LockOpenIcon sx={{fontSize:50}}/>} text="登录" size={90}
          top="calc( 50vh - 48px )" left="15vw" />
        </Link>

        <Link to="/Register" className='link'>
          <IconButton theIcon={<PersonIcon sx={{fontSize:50}}/>} text="注册" size={90}
          top="calc( 50vh - 48px )" left="calc(85vw - 96px)" />
        </Link>
      </div>
    );
  }

}

class RegisterPage extends React.Component{

  

  constructor(props){
    super(props);
    this.state={
      iCode:"",
      Username:"",
      Nickname:"",
      Password1:"",
      Password2:"",
    };
    this.handleInputChange=this.handleInputChange.bind(this);
    this.PostRegister=this.PostRegister.bind(this);
  }

  handleInputChange(event){
    const target=event.target;
    const name= target.name;
    const value=target.value;
    this.setState({
      [name]:value
    });
  }

  PostRegister(){
    var navigate=this.props.navigate;

    
    if(this.state.Username.length<1){
      alert("请输入用户名!");
      return;
    }
    if(this.state.Nickname.length<1){
      alert("请输入昵称!");
      return;
    }
    if(this.state.Password1.length<1){
      alert("请输入密码!");
      return;
    }
  
    if(this.state.Username.length>10){
      alert("用户名长度超过10了!");
      return;
    }

    if(this.state.Nickname.length>10){
      alert("昵称长度超过10了!");
      return;
    }

    if(this.state.iCode.length>20){
      alert("邀请码太长了!");
      return;
    }

    if(this.state.Password1!=this.state.Password2){
      alert("两次输入的密码不一致!");
      return;
    }

    if(this.state.Password1.length>30){
      alert("密码太长了!");
      return;
    }

    var RJ={
      iCode:this.state.iCode,
      Username:this.state.Username,
      Nickname:this.state.Nickname,
      Password:this.state.Password1,
    }

    var xmlhttp=new XMLHttpRequest();
    //xmlhttp.withCredentials=true;//这样，POST||GET请求才可设置Cookie!
    xmlhttp.onreadystatechange=function()
    {
        if(xmlhttp.readyState==4&&xmlhttp.status==200)
        {
            var resJson=JSON.parse(xmlhttp.responseText);
            //alert(res);
            if(resJson.state=="Failed")
            {
                alert(`注册失败:${resJson.reason}`);
            }
            else if(resJson.state=="Succeed")
            {
                alert("注册成功!");
                localStorage.setItem("token",resJson.token);
                navigate('/UserConsole');
            }
            //window.close();
        }
    }
    xmlhttp.open("POST",`http://shrike.site:10000/Register`,true);
    xmlhttp.setRequestHeader("Content-type","text/plain");
    xmlhttp.send(JSON.stringify(RJ));
  }

  render(){
    return(
      <div className='homepage'>
        <Sizedbox h="10vh"/>
        <input name='iCode' type="text" value={this.state.iCode} onChange={this.handleInputChange}
        placeholder="邀请码" className='my_input'/>
        <input name='Username' type="text" value={this.state.Username} onChange={this.handleInputChange}
        placeholder="用户名" className='my_input'/>
        <input name='Nickname' type="text" value={this.state.Nickname} onChange={this.handleInputChange}
        placeholder="昵称" className='my_input'/>
        <input name='Password1' type="password" value={this.state.Password1} onChange={this.handleInputChange}
        placeholder="密码" className='my_input'/>
        <input name='Password2' type="password" value={this.state.Password2} onChange={this.handleInputChange}
        placeholder="确认密码" className='my_input'/>

        <Link to="/" className='link'>
          <IconButton theIcon={<UndoIcon sx={{fontSize:30}}/>} text="返回" size={60}
          top="calc( 70vh - 48px )" left="22vw" />
        </Link>
        <IconButton theIcon={<PersonIcon sx={{fontSize:30}}/>} text="注册" size={60}
          top="calc( 70vh - 48px )" left="calc(78vw - 66px)" 
          OnPressed={()=>{
            this.PostRegister();
          }}
          // route="/UserConsole"
          />
      </div>
    );
  }

}

class SignInPage extends React.Component{

  
  constructor(props){
    super(props);
    this.state={
      iCode:"",
      Username:"",
      Password:"",
    };
    this.handleInputChange=this.handleInputChange.bind(this);
    this.PostSignIn=this.PostSignIn.bind(this);
  }

  handleInputChange(event){
    const target=event.target;
    const name= target.name;
    const value=target.value;
    this.setState({
      [name]:value
    });
  }

  PostSignIn(){
    var navigate=this.props.navigate;

    
    if(this.state.Username.length<1){
      alert("请输入用户名!");
      return;
    }
    if(this.state.Password.length<1){
      alert("请输入密码!");
      return;
    }
  
    if(this.state.Username.length>10){
      alert("用户名长度超过10了!");
      return;
    }

    if(this.state.iCode.length>20){
      alert("邀请码太长了!");
      return;
    }

    if(this.state.Password.length>30){
      alert("密码太长了!");
      return;
    }

    var RJ={
      iCode:this.state.iCode,
      Username:this.state.Username,
      Password:this.state.Password,
    }

    var xmlhttp=new XMLHttpRequest();
    //xmlhttp.withCredentials=true;//这样，POST||GET请求才可设置Cookie!
    xmlhttp.onreadystatechange=function()
    {
        if(xmlhttp.readyState==4&&xmlhttp.status==200)
        {
            var resJson=JSON.parse(xmlhttp.responseText);
            //alert(res);
            if(resJson.state=="Failed")
            {
                alert(`登录失败:${resJson.reason}`);
            }
            else if(resJson.state=="Succeed")
            {
                alert("登录成功!");
                localStorage.setItem("token",resJson.token);
                navigate('/UserConsole');
            }
            //window.close();
        }
    }
    xmlhttp.open("POST",`http://shrike.site:10000/SignIn`,true);
    xmlhttp.setRequestHeader("Content-type","text/plain");
    xmlhttp.send(JSON.stringify(RJ));
  }

  render(){
    return(
      <div className='homepage'>
        <Sizedbox h="10vh"/>
        <input name='iCode' type="text" value={this.state.iCode} onChange={this.handleInputChange}
        placeholder="邀请码" className='my_input'/>
        <input name='Username' type="text" value={this.state.Username} onChange={this.handleInputChange}
        placeholder="用户名" className='my_input'/>
        <input name='Password' type="password" value={this.state.Password} onChange={this.handleInputChange}
        placeholder="密码" className='my_input'/>
        
        <Link to="/" className='link'>
          <IconButton theIcon={<UndoIcon sx={{fontSize:30}}/>} text="返回" size={60}
          top="calc( 70vh - 48px )" left="22vw" />
        </Link>
        <IconButton theIcon={<VpnKeyIcon sx={{fontSize:30}}/>} text="登录" size={60}
          top="calc( 70vh - 48px )" left="calc(78vw - 66px)" 
          OnPressed={()=>{
            this.PostSignIn();
          }}
          // route="/UserConsole"
          />
      </div>
    );
  }

}

class UserConsolePage extends React.Component{

  constructor(props){
    super(props);
    this.state={
      Nickname:"...",
      // CopyText:"???",
    };
    this.SendTokenAndCopy=this.SendTokenAndCopy.bind(this);
    this.copyobj=null;
  }

  componentDidMount(){
    var xmlhttp=new XMLHttpRequest();
    var that=this;
    //xmlhttp.withCredentials=true;//这样，POST||GET请求才可设置Cookie!
    xmlhttp.onreadystatechange=function()
    {
        if(xmlhttp.readyState==4&&xmlhttp.status==200)
        {
            var resJson=JSON.parse(xmlhttp.responseText);
            //alert(res);
            if(resJson.state=="Failed")
            {
                alert(`鉴权失败:${resJson.reason}`);
            }
            else if(resJson.state=="Succeed")
            {
              that.setState({
                Nickname:resJson.Nickname,
              });
            }
            //window.close();
        }
    }
    xmlhttp.open("POST",`http://shrike.site:10000/Authentication`,true);
    xmlhttp.setRequestHeader("Content-type","text/plain");
    var UploadJson={
      token:localStorage.getItem("token"),
    }
    xmlhttp.send(JSON.stringify(UploadJson));
    this.SendTokenAndCopy();
  }

  SendTokenAndCopy(){
    var xmlhttp=new XMLHttpRequest();
    var that=this;
    //alert(JSON.stringify(this.state));
    
    xmlhttp.onreadystatechange=function()
    {
        if(xmlhttp.readyState==4&&xmlhttp.status==200)
        {
            //alert(xmlhttp.responseText);
            var resJson=JSON.parse(xmlhttp.responseText);
            //alert(res);
            if(resJson.state=="Failed")
            {
                alert(`鉴权失败:${resJson.reason}`);
            }
            else if(resJson.state=="Succeed")
            {
              var GeneratedURL=resJson.GeneratedURL;
              // that.setState({
              //   CopyText:GeneratedURL,
              // });
              that.copyobj=new Clipboard('.needcopy', {
                text: function () {
                  return GeneratedURL;
                },
              });
            }
            
            
        }
    }

    xmlhttp.open("POST",`http://shrike.site:10000/GetURL`,true);
    xmlhttp.setRequestHeader("Content-type","text/plain");
    var UploadJson={
      token:localStorage.getItem("token"),
    }
    xmlhttp.send(JSON.stringify(UploadJson));

  }
  

  render(){
    var that=this;
    
    return(
      <div className='homepage'>
        <p className='title1 engf'>{`Hi,${this.state.Nickname}!`}</p>
        <Link to="/UnansweredPage" className='link'>
          <IconButton theIcon={<ChatIcon sx={{fontSize:40}}/>} text="未回答" size={90}
          top="calc( 25vh )" left="15vw" />
        </Link>
        <Link to="/AnsweredPage" className='link'>
          <IconButton theIcon={<DoneIcon sx={{fontSize:40}}/>} text="已回答" size={90}
          top="calc( 25vh )" left="calc(85vw - 96px)" />
        </Link>
        <IconButton theIcon={<AttachFileIcon sx={{fontSize:40}}/>} text="提问链接" size={90}
          top="calc( 70vh - 96px )" left="15vw" needcopy={1}
          OnPressed={()=>{
            alert("提问链接已复制到剪贴板!");
          }}
           />
        <IconButton theIcon={<MoreHorizIcon sx={{fontSize:40}}/>} text="更多功能" size={90}
        top="calc( 70vh - 96px )" left="calc(85vw - 96px)" />
      </div>
    );
  }

}

// function NumOfLF(str){
//   var res=0;
//   var i;
//   for(i=0;i<=str.length-1;i++){
//     if(str[i]=='\n'){
//       res++;
//     }
//   }
//   return res;
// }

function SafeStr(str){
  var total=0;
  var res="";
  var CurrentIndex=0;
  while(total<81&&CurrentIndex<=str.length-1){
    res=res+str[CurrentIndex];
    var add=1;
    if(str[CurrentIndex]=='\n')add=20;
    total+=add;
    CurrentIndex++;
  }
  if(total>=81&&CurrentIndex!=str.length)res=res+"......";
  return res;
}

function OneQuestion(props){
  //var RealLen=props.Question.length+NumOfLF(props.Question)*20;
  const navigate = useNavigate();
  return(

    <div className='question_out question_column' onClick={()=>{
      localStorage.setItem("QuestionID",props.id);
      navigate('/QuestionDetail');
    }}>
      <div className='question_time'>{props.Time}</div>
      <div className='triangle_out'>
        <div className='triangle2'></div>
      </div>
      <p className='question_p'>{SafeStr(props.Question)}</p>
    </div>
    
    
  );
}

class UnansweredPage extends React.Component{

  constructor(props){
    super(props);
    this.state={
      Nickname:"...",
      AnswerList:[],
      CurrentTotal:0,
      HaveRest:1,
    }
    this.Get8Question=this.Get8Question.bind(this);
    //this.CurrentTotal=0;
  }

  componentDidMount(){
    this.Get8Question();
  }

  Get8Question(){
    var xmlhttp=new XMLHttpRequest();
    var that=this;
    //xmlhttp.withCredentials=true;//这样，POST||GET请求才可设置Cookie!
    xmlhttp.onreadystatechange=function()
    {
        if(xmlhttp.readyState==4&&xmlhttp.status==200)
        {
            var resJson=JSON.parse(xmlhttp.responseText);
            //alert(res);
            if(resJson.state=="Failed")
            {
                alert(`鉴权失败:${resJson.reason}`);
            }
            else if(resJson.state=="Succeed")
            {
              var AnswerList2=that.state.AnswerList.slice(0,that.state.AnswerList.length);
              var i;
              for(i=0;i<=resJson.AnswerList.length-1;i++){
                AnswerList2.push(resJson.AnswerList[i]);
              }
              that.setState({
                Nickname:resJson.Nickname,
                AnswerList:AnswerList2,
                CurrentTotal:that.state.CurrentTotal+resJson.AnswerList.length,
                HaveRest:resJson.HaveRest,
              });
              
            }
            //window.close();
        }
    }
    xmlhttp.open("POST",`http://shrike.site:10000/Get8Question`,true);
    xmlhttp.setRequestHeader("Content-type","text/plain");
    var UploadJson={
      token:localStorage.getItem("token"),
      CurrentTotal:that.state.CurrentTotal,
    }
    xmlhttp.send(JSON.stringify(UploadJson));
  }

  render(){
    return(
      <div className='hpstyle'>
        <Sizedbox h="10px"/>
        <p className='title4 wkf'>{`${this.state.Nickname}未回答的问题`}</p>
        <div className='bg'></div>
        {
          (this.state.HaveRest==0&&this.state.CurrentTotal==0)
          ?<p className='title4 wkf'>没有未回答的问题</p>
          : <ul>
          {this.state.AnswerList.map((QuestionObj)=><div key={QuestionObj.id}>
            <OneQuestion Question={QuestionObj.Question} Time={QuestionObj.Time} id={QuestionObj.id}/>
          </div>)}
        </ul>
        }
       
        {
          this.state.HaveRest?
          <div className="ajax" onClick={this.Get8Question}>
          <ArrowCircleDownIcon sx={{fontSize:40,color:"white"}} />
          </div>
          :<div></div>
        }
        <Sizedbox h="10px"/>
        <Link to="/UserConsole" className="back_link">
          <UndoIcon sx={{fontSize:30}}/>
        </Link>
      </div>
    );
  }

}

class QuestionDetail extends React.Component{

  constructor(props){
    super(props);
    this.state={
      AnswerContent:"",
      IsSent:0,
      QuestionObj:{},
    };
    this.handleInputChange=this.handleInputChange.bind(this);
    this.Ignore=this.Ignore.bind(this);
    this.SendAnswer=this.SendAnswer.bind(this);
  }

  handleInputChange(event){
    const target=event.target;
    const name= target.name;
    const value=target.value;
   
    if(target.value.length<=500){
      this.setState({
        [name]:value
      });
    }
    else{
      alert("字数太多了!");
    }
  }
  
  Ignore(){
    var xmlhttp=new XMLHttpRequest();
    var that=this;
    xmlhttp.onreadystatechange=function()
    {
        if(xmlhttp.readyState==4&&xmlhttp.status==200)
        {
            var resJson=JSON.parse(xmlhttp.responseText);
            //alert(res);
            if(resJson.state=="Failed")
            {
                alert(`鉴权失败:${resJson.reason}`);
            }
            else if(resJson.state=="Succeed")
            {
              
              that.setState({
               IsSent:2,
              });
              alert("操作成功!");
            }
        }
    }
    xmlhttp.open("POST",`http://shrike.site:10000/Ignore`,true);
    xmlhttp.setRequestHeader("Content-type","text/plain");
    var UploadJson={
      token:localStorage.getItem("token"),
      id:that.state.QuestionObj.id,
    }
    xmlhttp.send(JSON.stringify(UploadJson));
  }
  SendAnswer(){
    var xmlhttp=new XMLHttpRequest();
    var that=this;
    xmlhttp.onreadystatechange=function()
    {
        if(xmlhttp.readyState==4&&xmlhttp.status==200)
        {
            var resJson=JSON.parse(xmlhttp.responseText);
            //alert(res);
            if(resJson.state=="Failed")
            {
                alert(`鉴权失败:${resJson.reason}`);
            }
            else if(resJson.state=="Succeed")
            {
              
              that.setState({
               IsSent:1,
              });  
              alert("发送成功!")
            }
        }
    }
    xmlhttp.open("POST",`http://shrike.site:10000/SendAnswer`,true);
    xmlhttp.setRequestHeader("Content-type","text/plain");
    var UploadJson={
      token:localStorage.getItem("token"),
      id:that.state.QuestionObj.id,
      answer:that.state.AnswerContent,
    }
    xmlhttp.send(JSON.stringify(UploadJson));
  }

  componentDidMount(){
    var xmlhttp=new XMLHttpRequest();
    var that=this;
    xmlhttp.onreadystatechange=function()
    {
        if(xmlhttp.readyState==4&&xmlhttp.status==200)
        {
            var resJson=JSON.parse(xmlhttp.responseText);
            //alert(res);
            if(resJson.state=="Failed")
            {
                alert(`鉴权失败:${resJson.reason}`);
            }
            else if(resJson.state=="Succeed")
            {
              
              that.setState({
               QuestionObj:resJson.QuestionObj,
               AnswerContent:resJson.QuestionObj.Answer,
              });  
            }
        }
    }
    xmlhttp.open("POST",`http://shrike.site:10000/GetQuestionInfo`,true);
    xmlhttp.setRequestHeader("Content-type","text/plain");
    var UploadJson={
      token:localStorage.getItem("token"),
      id:localStorage.getItem("QuestionID"),
    }
    xmlhttp.send(JSON.stringify(UploadJson));
    //alert(JSON.stringify(this.QuestionObj));
  }

  render(){
    return(
      <div className='hpstyle'>
        <div className='bg'></div>

        <p className='title4 wkf'>问题详情</p>
        <div className='question_out detail_qo'>
          <div className='question_time'>{this.state.QuestionObj.Time}</div>
          <div className='triangle_out'>
            <div className='triangle2'></div>
          </div>
          <p className='question_p'>{this.state.QuestionObj.Question}</p>
        </div>

        <p className='title4 wkf'>{this.state.QuestionObj.IsPrivate?"(仅双方可见)":"(所有人可见)"}</p>

        <div className='answer_out'>
          <textarea name='AnswerContent' className='AnswerInput wkf' value={this.state.AnswerContent}
          onChange={this.handleInputChange} placeholder="在这里写您的回答"></textarea>
          <div className='triangle'></div>
        </div>

        {this.state.QuestionObj.Answered==0?
        (this.state.IsSent
        ?<p className='title4 wkf'>{this.state.IsSent==1?"已发送":"已忽略"}</p>
        :<div className='answer_buttons'>
        <IconButton theIcon={<CloseIcon sx={{fontSize:25}}/>} text="忽略" size={55}
        left="20vw" OnPressed={()=>{
          var r=window.confirm("此操作不可撤销,确认忽略该问题?");
          if(r)this.Ignore();
        }}/>
        <IconButton theIcon={<SendIcon sx={{fontSize:25}}/>} text="发送" size={55}
        left="calc(80vw - 61px)" OnPressed={this.SendAnswer}/>
        </div>)
        :<div className='answer_buttons'>
        <IconButton theIcon={<EditIcon sx={{fontSize:25}}/>} text="更新" size={55}
        left="calc(50vw - 30.5px)" OnPressed={this.SendAnswer}/>
        </div>}

        <Sizedbox h="20px"/>
        <Link to={this.state.QuestionObj.Answered==0?"/UnansweredPage":"/AnsweredPage"} className="back_link">
          <UndoIcon sx={{fontSize:30}}/>
        </Link>
      </div>
    );
  }

}
class AnsweredPage extends React.Component{

  constructor(props){
    super(props);
    this.state={
      Nickname:"...",
      AnswerList:[],
      CurrentTotal:0,
      HaveRest:1,
    }
    this.Get8AnsweredQuestion=this.Get8AnsweredQuestion.bind(this);
    //this.CurrentTotal=0;
  }

  componentDidMount(){
    this.Get8AnsweredQuestion();
  }

  Get8AnsweredQuestion(){
    var xmlhttp=new XMLHttpRequest();
    var that=this;
    //xmlhttp.withCredentials=true;//这样，POST||GET请求才可设置Cookie!
    xmlhttp.onreadystatechange=function()
    {
        if(xmlhttp.readyState==4&&xmlhttp.status==200)
        {
            var resJson=JSON.parse(xmlhttp.responseText);
            //alert(res);
            if(resJson.state=="Failed")
            {
                alert(`鉴权失败:${resJson.reason}`);
            }
            else if(resJson.state=="Succeed")
            {
              var AnswerList2=that.state.AnswerList.slice(0,that.state.AnswerList.length);
              var i;
              for(i=0;i<=resJson.AnswerList.length-1;i++){
                AnswerList2.push(resJson.AnswerList[i]);
              }
              that.setState({
                Nickname:resJson.Nickname,
                AnswerList:AnswerList2,
                CurrentTotal:that.state.CurrentTotal+resJson.AnswerList.length,
                HaveRest:resJson.HaveRest,
              });
              
            }
            //window.close();
        }
    }
    xmlhttp.open("POST",`http://shrike.site:10000/Get8AnsweredQuestion`,true);
    xmlhttp.setRequestHeader("Content-type","text/plain");
    var UploadJson={
      token:localStorage.getItem("token"),
      CurrentTotal:that.state.CurrentTotal,
    }
    xmlhttp.send(JSON.stringify(UploadJson));
  }

  render(){
    return(
      <div className='hpstyle'>
        <Sizedbox h="10px"/>
        <p className='title4 wkf'>{`${this.state.Nickname}已回答的问题`}</p>
        <div className='bg'></div>
        
        {
          (this.state.HaveRest==0&&this.state.CurrentTotal==0)
          ?<p className='title4 wkf'>没有已回答的问题</p>
          : <ul>
          {this.state.AnswerList.map((QuestionObj)=><div key={QuestionObj.id}>
            <OneQuestion Question={QuestionObj.Question} Time={QuestionObj.Time} id={QuestionObj.id}/>
          </div>)}
        </ul>
        }

        
        {
          this.state.HaveRest?
          <div className="ajax" onClick={this.Get8AnsweredQuestion}>
          <ArrowCircleDownIcon sx={{fontSize:40,color:"white"}} />
          </div>
          :<div></div>
        }
        <Sizedbox h="10px"/>
        <Link to="/UserConsole" className="back_link">
          <UndoIcon sx={{fontSize:30}}/>
        </Link>
      </div>
    );
  }

}

class NotFound extends React.Component{

  constructor(props){
    super(props);
  }

  render(){
    return(
      <div>
        <p style={{fontSize: 6 +"vw"}}>
          404 Not Found
        </p>
      </div>
    );
  }

}


const RegisterPage2=withRouter(RegisterPage);
const SignInPage2=withRouter(SignInPage);
const UserConsolePage2=withRouter(UserConsolePage);
const UnansweredPage2=withRouter(UnansweredPage);

const root = ReactDOM.createRoot(document.getElementById('root'));
document.title="JustChat";
root.render(
  <JustChatApp/>
  // <React.StrictMode>
   
  // </React.StrictMode>
);
