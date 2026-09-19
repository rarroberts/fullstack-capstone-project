
import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage() {

    //insert code here to create useState hook variables for email, password

    // insert code here to create handleLogin function and include console.log

		return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="login-card p-4 border rounded">
              <h2 className="text-center mb-4 font-weight-bold">Login</h2>

  		{/* insert code here to create input elements for the variables email and  password */}

  		{/* insert code here to create a button that performs the `handleLogin` function on click */}
				<p className="mt-4 text-center">
					New here? <a href="/app/register" className="text-primary">Register Here</a>
				</p>

            </div>
          </div>
        </div>
      </div>
    )
}

export default LoginPage;
