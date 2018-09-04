import React, { Component } from 'react';
import { firebaseConfig } from '../serpis';

let INITIAL_STATE = {
  lastKey: '',
  nextPage: 1,
  project: {},
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
      console.log( arrayOfKeys );

      let arrayProject = arrayOfKeys.reduce( ( conc, current ) => {
        conc[current] = snapshot.val()[current];
        return conc;
      }, {});

      last = arrayOfKeys[arrayOfKeys.length-1];

      console.log( arrayProject );

      this.setState({
        lastKey: arrayOfKeys[arrayOfKeys.length-1],
        project: { ...project, ...arrayProject },
        nextPage: nextPage+1,
        // lastPage: ( perPage !== snapshot.numChildren() ) ? !lastPage : lastPage
        lastPage: false,
      });

      console.log( this.state )
    });
  }

  clickLoadProject() {

    this.loadProject();

  }

  componentWillMount() {

    this.loadProject();

  }

  render() {
    let { lastKey, currentPage, project, lastPage } = this.state;

    return (
      <div>
        <h1>this is content </h1>

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