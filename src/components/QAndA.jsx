import React, { useEffect, useState } from 'react'
import { IoMdSearch } from "react-icons/io";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import toast from 'react-hot-toast';
import { MdQuestionAnswer } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import Swal from 'sweetalert2'
import { BiUpvote } from "react-icons/bi";

const QAndA = () => {
  const [open,setOpen]=useState(false);
  const [question,setQuestion]=useState('');
  const [description,setDescription]=useState('');
  const [data,setData]=useState([]);
  const [ansOpen,setAnsOpen]=useState(false);
  const [answer,setAnswer]=useState('');
  const [questionId,setQuestionId]=useState();
  const [answerData,setAnswerData]=useState([]);
  const [editId,setEditId]=useState();
  const [editAns,setEditAns]=useState();
  const [search,setSearch]=useState('');
  const [filteredData,setFilteredData]=useState([]);
  const [editQuesId,setEditQuesId]=useState();
  const [editQues,setEditQues]=useState('');
  const [editDesc,setEditDesc]=useState('');
  const id=localStorage.getItem('login_id');
  const name=localStorage.getItem('login');
  const handleDialog=()=>{
    setOpen(!open);
  }
  const handleChange=(e)=>{
    const term=e.target.value.toLowerCase();
    setSearch(term);
    const filtered=data.filter(request=>request.question.toLowerCase().includes(term));
    setFilteredData(filtered);
  }
  const handleAnswerDialog=(id)=>{
    setAnsOpen(!ansOpen);
    setQuestionId(id);
    getAnswerData(id);
  }
  const handleConfirm=()=>{
    const id = localStorage.getItem('login_id');
    if(id!==null){
      if(question!=='' && description!==''){
          fetch(`http://localhost:5059/api/Question?id=${id}&question=${question}&description=${description}`,{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
        })
        .then(res=>res.json())
        .then((result)=>{
            toast.success("Question Posted");
            handleDialog();
            getData();
        },(error)=>{
            toast.error("Error");
        })
        }
      else{
        toast.error("Please enter complete details!");
      }
    }
    else{
      toast.error("Please login to post question!");
    }
  }
  const getData=async()=>{
    const url=`http://localhost:5059/api/Question`;
        try{
            const response=await fetch(url);
            const data=await response.json();
            setFilteredData(data);
            setData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
  }
  const getAnswerData=async(id)=>{
    if(id){
      const url=`http://localhost:5059/api/Question/Get1?id=${id}`;
          try{
              const response=await fetch(url);
              const data=await response.json();
              setAnswerData(data);
          } catch (error) {
              console.error('Error fetching data:', error);
          }
    }
  }
  const handleAnswerConfirm=()=>{
    const id = localStorage.getItem('login_id');
    const name=localStorage.getItem('login');
    if(id!==null){
      if(answer!==''){
      fetch(`http://localhost:5059/api/Question/Post1?question_id=${questionId}&answer=${answer}&id=${id}&name=${name}`,{
        method:'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
    })
    .then(res=>res.json())
    .then((result)=>{
        toast.success("Answer Added");
        getAnswerData(questionId);
        setAnswer('');
    },(error)=>{
        toast.error("Error");
    })
    }
    else{
      toast.error("Please enter an answer!");
    }
    }
    else{
      toast.error("Please login to add answer!");
    }
  }
  const updateAnswer=(id)=>{
    fetch(`http://localhost:5059/api/Question/put1?id=${id}&ans=${editAns}`,{
        method:'PUT',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        })
        .then(res=>res.json())
        .then((result)=>{
            console.log(result);
            setEditId(null);
            setEditAns(null);
            getAnswerData(questionId);
        },(error)=>{
            toast.error('Failed');
        })
  }
  const updateQuestion=(id)=>{
    fetch(`http://localhost:5059/api/Question/put2?id=${id}&ques=${editQues}&desc=${editDesc}`,{
      method:'PUT',
      headers:{
          'Accept':'application/json',
          'Content-Type':'application/json'
      },
      })
      .then(res=>res.json())
      .then((result)=>{
          console.log(result);
          setEditQues(null);
          setEditDesc(null)
          setEditQuesId(null);
          getData();
      },(error)=>{
          toast.error('Failed');
      })
  }
  const deleteQuestion=(id)=>{
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText:'No',
      confirmButtonText: "Yes",
      backdrop: true,
      allowOutsideClick: false,
      customClass: {
        popup: "swal2-popup",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5059/api/Question/Delete1?id=${id}`,{
          method:'DELETE',
          headers:{
              'Accept':'application/json',
              'Content-Type':'application/json'
          },
          })
          .then(res=>res.json())
          .then((result)=>{
              toast.success("Question deleted!");
              getData();
          },(error)=>{
              toast.error('Failed');
          })
  }
  })}
  const handleDelete=(id)=>{
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText:'No',
      confirmButtonText: "Yes",
      backdrop: true,
      allowOutsideClick: false,
      customClass: {
        popup: "swal2-popup",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5059/api/Question?id=${id}`,{
          method:'DELETE',
          headers:{
              'Accept':'application/json',
              'Content-Type':'application/json'
          },
          })
          .then(res=>res.json())
          .then((result)=>{
              toast.success("Answer deleted!");
              getAnswerData(questionId);
          },(error)=>{
              toast.error('Failed');
          })
  }
  })}
  useEffect(()=>{
    getData();
  },[])
  return (
    <div className='mt-48 mb-60'>
        <div className="flex justify-center">
            <div className="relative">
                <IoMdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-2xl" />
                <input 
                    className="w-[500px] h-14 pl-12 pr-6 bg-white border border-gray-300 rounded-full shadow-md text-lg text-gray-700 placeholder-gray-500 outline-none hover:shadow-lg transition-shadow"
                    value={search}
                    onChange={handleChange}
                    placeholder="Search Questions"
                />
            </div>
            <button onClick={handleDialog} className="absolute top-0 mt-40 left-0 ml-20 mb-4 text-[18px] rounded-full bg-white text-green-800 hover:bg-green-600
               hover:text-white py-2 px-10 transition-colors duration-300 shadow-md">Post Question</button>
            <Dialog open={open} onClose={handleDialog} maxWidth="md" fullWidth>
                    <DialogTitle className='flex justify-center text-black'>Post Question</DialogTitle>
                    <DialogContent>
                    <label>Enter Question:<input onChange={(e)=>setQuestion(e.target.value)} type='text' className='border rounded-lg p-3 w-full focus:outline-none focus:ring-green-500 focus:border-green-500'/></label>
                    <label>Enter Description:<textarea rows={6} onChange={(e)=>setDescription(e.target.value)} type='text' className='border rounded-lg p-3 w-full focus:outline-none focus:ring-green-500 focus:border-green-500'/></label>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} color="primary">
                        Confirm
                    </Button>
                    </DialogActions>
                </Dialog>
        </div>
        <div className="w-[900px] mx-auto mt-20">
          <div className="flex flex-col gap-6">
            {filteredData.map((question, index) => (
              <div 
                key={index}
                className="bg-white p-4 border border-gray-300 rounded-lg shadow-md"
              >
                <div className='flex justify-between items-center'> 
                  <div className='flex-1'>
                    <p className="text-md font-semibold">{question.username}</p>
                    {question.question_id===editQuesId?(<div><input type="text" placeholder="Enter question..." value={editQues} onChange={(e)=>setEditQues(e.target.value)} className="border p-1 mt-1 w-full rounded-md focus:outline-none"/>
                  <textarea rows={4} type="text" placeholder="Enter description..." value={editDesc} onChange={(e)=>setEditDesc(e.target.value)} className="border p-1 mt-1 w-full rounded-md focus:outline-none"></textarea></div>):(<div><p className="mt-1 text-lg text-gray-800 font-semibold">{question.question}</p>
                  <p className="text-lg text-gray-800 font-medium">{question.description}</p></div>)}
                    <MdQuestionAnswer onClick={()=>handleAnswerDialog(question.question_id)} className='text-green-700 h-5 w-5 mt-2 cursor-pointer'/>
                  </div>
                  {question.user_id===parseInt(id) && <div className='flex items-center justify-end'>
                    {editQuesId===question.question_id?(<button onClick={()=>updateQuestion(question.question_id)} className='text-green-600 font-semibold ml-2'>Save</button>):
                    <MdEdit onClick={()=>{setEditQuesId(question.question_id);setEditQues(question.question);setEditDesc(question.description);}} className='text-blue-600 w-5 h-5 cursor-pointer'/>}
                    <MdDelete onClick={()=>deleteQuestion(question.question_id)} className='text-red-600 w-5 h-5 cursor-pointer'/>
                  </div>}
                </div>
                <Dialog open={ansOpen} onClose={()=>handleAnswerDialog(null)} maxWidth="md" fullWidth style={{ zIndex: 1000 }}>
                    <DialogTitle className='flex justify-center text-black'>Answers</DialogTitle>
                    <DialogContent>
                      <div className='max-h-60 overflow-y-auto mb-4 p-2 bg-gray-100 rounded-lg'>
                        {answerData.length>0?(
                        answerData.map((answer)=>(
                          <div key={index} className="bg-white p-3 mb-2 border border-gray-300 rounded-lg shadow-sm flex justify-between items-center">
                            <div className='flex-1'>
                              <p className="text-sm font-semibold">
                                <span className="text-green-700">{answer.username}</span>
                                <span className="text-gray-500 ml-2">({answer.name==='User'?'user':'mechanic'})</span>
                              </p>
                              {editId===answer.answer_id?(<input type="text" value={editAns} onChange={(e)=>setEditAns(e.target.value)} className="border p-1 mt-1 w-full rounded-md focus:outline-none"/>):
                              <p className="text-gray-800 text-base">{answer.answer}</p>}
                              {(answer.id!==parseInt(id) || answer.name!==name) && (<div className='flex items-center border rounded-xl p-1 w-max mt-2 bg-gray-50'>
                                <BiUpvote className='text-blue-600 w-5 h-5 cursor-pointer'/>
                              </div>)}
                            </div>
                            {(answer.id===parseInt(id) && answer.name===name) && <div className='flex items-center justify-end'>
                              {editId===answer.answer_id?(<button onClick={()=>updateAnswer(answer.answer_id)} className='text-green-600 font-semibold ml-2'>Save</button>):
                              <MdEdit onClick={()=>{setEditId(answer.answer_id);setEditAns(answer.answer);}} className='text-blue-600 w-5 h-5 cursor-pointer'/>}
                              <MdDelete onClick={()=>handleDelete(answer.answer_id)}className='text-red-600 w-5 h-5 cursor-pointer'/>
                            </div>}
                          </div>
                        ))):<p className='text-gray-500 text-sm italic'>No answers yet</p>}
                      </div>
                      <label>Enter Answer:<textarea rows={4} value={answer} onChange={(e)=>setAnswer(e.target.value)} type='text' className='border rounded-lg p-3 w-full focus:outline-none focus:ring-green-500 focus:border-green-500'/></label>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={()=>handleAnswerDialog(null)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleAnswerConfirm} color="primary">
                        Confirm
                    </Button>
                    </DialogActions>
                </Dialog>
              </div>
            ))}
          </div>
        </div>
    </div>
  )
}

export default QAndA