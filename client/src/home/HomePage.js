// HomePage.js

import React from "react";
import "./home.css";

function HomePage() {
  return (
    <div className="homePage">
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-lg-6">
            <div className="card card-body p-5 mt-4">
              <h1 className="display-4 text-danger text-center mb-4">¡SellerTaT!</h1>
              <p className="lead text-black text-center mb-4"> Un software simple que permite a una distribuidora de productos desechables y productos congelados automatizar la gestión de ventas de la compañía. </p>
              <hr className="my-4" />
              <p className="text-black text-center mb-4">Cuando estés dado de alta en la compañía como vendedor, podrás registrarte en la parte inferior. Saludos. 
              </p>
              <div className="text-center">
                <a
                  className="btn btn-outline-danger btn-lg rounded-pill px-5 py-3"
                  href="/usuarios"
                  role="button"
                >Registrarse</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;