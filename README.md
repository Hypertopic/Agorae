AGORAE – Participative knowledge management
===========================================

License: [GNU Affero General Public License](http://www.gnu.org/licenses/agpl.html)

Contact: <aurelien.benel@utt.fr>

Home page: <https://github.com/Hypertopic/Agorae>

Notice
------

Agorae is a server software. There is no need to install it on your own computer to use it. The usual way is to be "hosted" by one's own institution (ask your system administrator). If your use cases meet our research interests, we can also host your data on our community server.

Installation requirements
-------------------------

* Git client
* [CouchDB](http://couchdb.apache.org/)
* [CouchApp](https://github.com/jchris/couchapp) 
* [Argos](https://github.com/Hypertopic/Argos)

Installation procedure
----------------------

Argos has been installed at ``http://127.0.0.1:5984/argos``

* Type:

        git clone git@github.com:Hypertopic/Agorae.git
        cd Agorae

* Edit ``agorae.json`` to fit your settings:
  * define HTML ``footer`` and ``header``,
  * a set of servers (e.g. ``http://127.0.0.1:5984/argos/_design/argos/_rewrite/``),
  * a set of ``corpora`` (IDs),
  * a set of ``viewpoints`` (IDs),
  * ``auth``, an authentication service (e.g. ``http://127.0.0.1:5984/_session``).

* Type:

        couchapp push http://127.0.0.1:5984/argos 

* Go to http://127.0.0.1:5984/argos/_design/agorae/_rewrite/

