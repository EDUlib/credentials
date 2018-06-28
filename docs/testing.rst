Testing
=======

The command below runs the Python tests and code quality validation—Pylint and PEP8.

.. code-block:: bash

    $ make validate

Code quality validation can be run independently with:

.. code-block:: bash

    $ make quality

Writing Tests
-------------
Tests should be written for all new features. The `Django docs`_ are a good resource for learning how to test Django code.

.. _Django docs: https://docs.djangoproject.com/en/1.8/topics/testing/


Acceptance Testing
------------------

The project also includes acceptance tests used to verify behavior which relies on external systems like the LMS,
programs. At a minimum, these tests should be run against a staging environment before deploying
code to production to verify that critical user workflows are functioning as expected. With the right configuration
in place, the tests can also be run locally. Below you'll find an explanation of how to configure the LMS and the
Programs Service so that the acceptance tests can be run successfully.

Definitions
***********

Definitions of commonly used terms:

* LMS: The edX Learning Management System. Course content is found here.

Programs Configuration
**********************

#. Use the Programs Django admin to create a new XSeries program consisting of the demo course which comes installed on devstack by default.

Credentials Configuration
*************************

#. In the Credentials Django admin, configure a certificate for the XSeries program created above.

#. Download the geckodriver package, untar it, and copy the executable into the container's /usr/local/bin:

https://github.com/mozilla/geckodriver/releases/download/v0.20.1/geckodriver-v0.20.1-linux64.tar.gz

...

(Instructions written for Ubuntu 16.04)

apt install chromium-chromedriver
ln -s /usr/lib/chromium-browser/chromedriver /usr/local/bin/

NOPE? Install Chrome - https://www.google.com/chrome/

Somehow add --no-sandbox --disable-gpu to arguments...

Can't add those via chromedriver...

Next: go back to trying firefox, now that we're in a xenial container


LMS Configuration
*****************

Running the acceptance tests successfully requires that you first correctly configure the ``LMS`` and ``Credentials``. We'll start with the ``LMS``, assuming a standard devstack installation.

#. In the Django admin, create a new access token for the superuser which will be used for acceptance tests. Set the client to the OAuth2 client for credentials. Make note of this token; it is required to run the acceptance tests. You may already have some of these tokens. In which case, you can just make note of the value for later.

#. At a minimum, the acceptance tests require the existence of only one demo course on the LMS instance being used for testing. The edX Demonstration Course should be present by default on most LMS instances.

#. Enroll the user in the demo course, complete it, and generate a certificate. This may require using the course's instructor dashboard to allow self-service certificate generation.

Environment Variables
*********************

Our acceptance tests rely on configuration which can be specified using environment variables.

.. list-table::
   :widths: 20 60 10 10
   :header-rows: 1

   * - Variable
     - Description
     - Required?
     - Default Value
   * - ACCESS_TOKEN
     - OAuth2 access token used to authenticate requests
     - Yes
     - N/A
   * - ENABLE_OAUTH2_TESTS
     - Whether to run tests verifying that the LMS can be used to sign into Otto
     - No
     - True
   * - LMS_URL_ROOT
     - URL root for the LMS
     - Yes
     - N/A
   * - LMS_USERNAME
     - Username belonging to an LMS user to use during testing
     - Yes
     - N/A
   * - LMS_EMAIL
     - Email address used to sign into the LMS
     - Yes
     - N/A
   * - LMS_PASSWORD
     - Password used to sign into the LMS
     - Yes
     - N/A
   * - CREDENTIALS_ROOT_URL
     - URL root for credentials service
     - Yes
     - N/A

Running Acceptance Tests
************************

Run all acceptance tests by executing ``make accept``. To run a specific test, execute::

    $ xvfb-run nosetests -v <path/to/the/test/module>

As discussed above, the acceptance tests rely on configuration which can be specified using environment variables. For example, when running the acceptance tests against local instances of Programs and the LMS, you might run::

    $ SELENIUM_BROWSER=chrome CREDENTIALS_ROOT_URL="http://edx.devstack.credentials:18150/" LMS_ROOT_URL="http://edx.devstack.lms:18000" LMS_USERNAME="<username>" LMS_EMAIL="<email address>" LMS_PASSWORD="<password>" ACCESS_TOKEN="<access token>" PROGRAM_UUID=<program_uuid> xvfb-run make accept

When running against a production-like staging environment, you might run::

    $ CREDENTIALS_ROOT_URL="https://credentials.stage.edx.org" LMS_URL_ROOT="https://courses.stage.edx.org" LMS_USERNAME="<username>" LMS_EMAIL="<email address>" LMS_PASSWORD="<password>" ACCESS_TOKEN="<access token>" PROGRAM_UUID=<program_uuid> xvfb-run make accept
