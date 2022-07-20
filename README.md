liberty-shopfront-webapp
====================

A sample app to be deployed on openshift environments that calls backend z/OS CICS and IMS

To develop locally issue `mvn liberty:dev`

To build on OpenShift leveraging s2i using [OpenLiberty s2i image](https://github.com/OpenLiberty/open-liberty-s2i)

Incremental build is supported

Note: to build this repository with maven you must specify `-Popenshift`, eg `mvn clean package -Popenshift`

  OpenShift `oc` usage
--------------------

If your openshift installation doesn't already contain the Open Liberty image:

* Adding the image streams: `oc create -f imagestreams/openliberty-ubi-min.json` 
An `Open Liberty` imagestream will be created.

* When adding the `Open Liberty` imagestream to the `openshift` namespace, the OpenShift catalog is automatically populated with a the template `Open Liberty` allowing you to
create a new build and new deployment from the OpenShift Web Console.