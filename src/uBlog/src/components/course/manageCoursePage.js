import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as courseActions from '../../actions/courseActions';
import CourseForm from './CourseForm';
import toastr from 'toastr';

class ManageCoursePage extends React.Component{
  constructor(props, context){
    super(props, context);

    this.state = {
      course: Object.assign({}, this.props.course),
      errors:{},
      saving: false
    };

    this.updateCourseState = this.updateCourseState.bind(this);
    this.saveCourse = this.saveCourse.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(this.props.course.id != nextProps.course.id){
      //Necessary to populate form when existing course is loaded directly.
      this.setState({course: Object.assign({}, nextProps.course)});
    }
  }

  updateCourseState(event){
    const field = event.target.name;
    let course = this.state.course;
    course[field] = event.target.value;
    return this.setState({course: course});
  }

  saveCourse(event){
    event.preventDefault();
    this.setState({saving: true});
    this.props.actions.saveCourse(this.state.course)
      .then(() => this.redirect())
      .catch(error =>{
        toastr.error(error);
        this.setState({saving: false});
      });//呈现错误提示
  }

  redirect(){
    //设置当前component的部分状态
    this.setState({saving: false});
    toastr.success('Course saved');

    this.context.router.push('/courses');
  }

  render(){
    return(
        <CourseForm
          allAuthors={this.props.authors}
          onChange = {this.updateCourseState}
          onSave = {this.saveCourse}
          course={this.state.course}
          errors={this.state.errors}
          saving ={this.state.saving}/>
    );
  }

}

ManageCoursePage.propTypes = {
  course: PropTypes.object.isRequired,
  authors: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

//todo
//Pull in the React Router context so router is available on this.context.router.
ManageCoursePage.contextTypes = {
  router: PropTypes.object.isRequired
};


function getCourseById(courses, id){
  const course = courses.filter(course => course.id == id);

  if(course) return course[0];
  return null;
}


function mapStateToProps(state, ownProps){
  const courseId = ownProps.params.id;  //from the path '/course/:id'

  let course = {id:'', watchHref:'', title:'', authorId:'', length:'', category:''};

  if(courseId && state.courses.length > 0){
    course = getCourseById(state.courses, courseId);
  }

  const authorsFormattedForDropdown = state.authors.map(author =>{
    //映射成select可以用的键值对
    return{
      value: author.id,
      text:author.firstName + ' ' + author.lastName
    };
  });
  return{
    course: course,
    authors: authorsFormattedForDropdown

  };
}

function mapDispatchToProps(dispatch){

  return{
    actions: bindActionCreators(courseActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage);



























