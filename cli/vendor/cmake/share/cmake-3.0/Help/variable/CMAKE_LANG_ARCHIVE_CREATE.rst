CMAKE_<LANG>_ARCHIVE_CREATE
---------------------------

Rule variable to create a new static archive.

This is a rule variable that tells CMake how to create a static
archive.  It is used in place of CMAKE_<LANG>_CREATE_STATIC_LIBRARY on
some platforms in order to support large object counts.  See also
CMAKE_<LANG>_ARCHIVE_APPEND and CMAKE_<LANG>_ARCHIVE_FINISH.
