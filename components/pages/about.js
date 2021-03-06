/* eslint-disable */
import React from 'react';
import { Link } from 'react-router-dom';
/* eslint-enable */
import imgSources from '../../assets/img-sources';

export default () => {
  return (
    <div className="page-about">
      <div className="d-flex flex-column align-items-center">
        <p className="col-sm-9 col-md-7 col-lg-6 col-xl-5 mb-5 p-3 p-sm-0">
          Aggregate information from frequently visited web pages and view them on this single app.
          Say you're a live music fan who visits <em>multiple</em> event calendars routinely --
          instead, submit the web pages where the calender exists and let the app gather the
          information here. <Link to="/login">Try it</Link>!
        </p>
        <img
          src={imgSources.previewWebsite}
          className="img-fluid col-11 col-md-10 col-lg-9 col-xl-8"
        />
      </div>
    </div>
  );
};
