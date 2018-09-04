import React, { Component } from 'react';
import { firebaseConfig } from '../serpis';

let INITIAL_STATE = {
  lastKey: '',
  nextPage: 1,
  project: [],
  lastPage: false,
}
const perPage = 4;

class Content extends Component {
  
  constructor(props){
    super(props);
    this.state = { ...INITIAL_STATE };

    // window.onscroll = () => {
    //   if( window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight ){
    //     this.loadProject();
    //   }
    // }
    this.clickLoadProject = this.clickLoadProject.bind(this);
  }

  loadProject = () => {
    let { lastKey, lastPage, nextPage, project } = this.state;
    let dataProject, last;
    console.log( 'lastKey: ' + lastKey );

    dataProject = (nextPage === 1) ? firebaseConfig.database().ref('project').orderByKey().limitToLast(perPage) : firebaseConfig.database().ref('project').orderByKey().endAt(lastKey).limitToLast(perPage+1);

    dataProject.on('value', snapshot => {
      let arrayOfKeys = (nextPage === 1) ? Object.keys( snapshot.val() ).sort().reverse() : Object.keys( snapshot.val() ).sort().reverse().slice(1);
      // console.log( arrayOfKeys );

      let arrayProject = arrayOfKeys.map( (val, key) => (
        snapshot.val()[val]
      ))

      last = arrayOfKeys[arrayOfKeys.length-1];

      // console.log( arrayProject );

      this.setState({
        lastKey: arrayOfKeys[arrayOfKeys.length-1],
        project: [ ...project, ...arrayProject ],
        nextPage: nextPage+1,
        lastPage: ( snapshot.numChildren() < perPage ) ? !lastPage : lastPage
      });

      console.log( this.state.project )
      // project.map( ( val, idx ) => {
      //   console.log( val.company );
      // })
    });

  }

  clickLoadProject() {

    this.loadProject();

  }

  componentWillMount() {

    this.loadProject();

  }

  render() {
    let { lastKey, currentPage, lastPage } = this.state;
    return (
      <div>
        <h1>this is content </h1>
        <ul>
        {
          this.state.project.map( (item, index) => (
            <li key={index}>
              <h5>{item.name}</h5>
              <p>{item.description}</p>
            </li>
          ))
        }
        </ul>

        { 
          ( lastPage ) && (
            <h6>No more Project</h6>
          )
        }

        <button className={ lastPage ? 'element-hide' : 'element-show'} onClick={this.clickLoadProject}>Load Project</button>
      </div>
    );
  }
}

export default Content;