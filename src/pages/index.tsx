import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";

import styles from "./index.module.css";

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Wellcome to Leo Nguyen's Documents`}
      description="Description will go into a meta tag in <head />"
    >
      <main>
        <div className="overflow-y-auto sm:p-0 pt-4 pr-4 pb-20 pl-4 bg-gray-800">
          <div className="flex justify-center items-end text-center min-h-screen sm:block">
            <div className="bg-gray-500 transition-opacity bg-opacity-75"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              ​
            </span>
            <div className="inline-block text-left bg-gray-900 rounded-lg overflow-hidden align-bottom transition-all transform shadow-2xl sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
              <div className="items-center w-full mr-auto ml-auto relative max-w-7xl md:px-12 lg:px-24">
                <div className="grid grid-cols-1">
                  <div className="mt-4 mr-auto mb-4 ml-auto bg-gray-900 max-w-lg">
                    <div className="flex flex-col items-center pt-6 pr-6 pb-6 pl-6">
                      <img
                        src={require("@site/static/img/leo.jpg").default}
                        className="flex-shrink-0 object-cover object-center btn- flex w-16 h-16 mr-auto -mb-8 ml-auto rounded-full shadow-xl"
                      />
                      <p className="mt-8 text-2xl font-semibold leading-none text-white tracking-tighter lg:text-3xl">
                        Leo Nguyen
                      </p>
                      <p className="mt-3 text-base leading-relaxed text-center text-gray-200">
                        Hello, my name's Leo Nguyen. I'm a backend developer.
                        This blog is where I store the documents use when
                        researching and taking notes to reuse when need:
                      </p>
                      <p className="mt-3 text-base leading-relaxed text-center text-gray-200">
                        <span className="badge badge-accent">
                          <a href="/docs/category/server">Server</a>
                        </span>
                        ,<span className="badge badge-accent">Golang</span>,
                        <span className="badge badge-accent">Nodejs</span>,
                        <span className="badge badge-accent">Magento</span>,
                      </p>
                      <div className="w-full mt-6">
                        <a
                          href="mailto:webmaster@example.com"
                          className="flex text-center items-center justify-center w-full pt-4 pr-10 pb-4 pl-10 text-base
                    font-medium text-white bg-indigo-600 rounded-xl transition duration-500 ease-in-out transform
                    hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Contact
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
