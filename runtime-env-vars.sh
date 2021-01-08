#!/bin/bash

<< 'DESCRIPTION'
  We want to add environment variables to the global window object so JS can
  access them at runtime. This script populates an object accessible to the
  front-end with the given environment variable names as arguments.

  This script should be run on the running container to configure
  environment-specific variables that are required by the front-end.

  It builds a JS file that that defines an object window.env with the shape

    window.env = {
      VAR1: 'VALUE1',
      VAR2: 'VALUE2',
      VAR3: 'VALUE3',
    }

  when the keys--VAR1, VAR2, and VAR3--are passed as args to this script,
  where the values--VALUE1, VALUE2, VALUE3--will be the values of the host
  machine's environment variables.

  Example:

    Suppose the front-end bundle needs access to two host container's
    environment variables: DUG_URL and PUBLIC_URL. Then we would run our our
    container and then execute

      $ bash runtime-env-vars.sh DUG_URL PUBLIC_URL

    from within the running container, or alternatively

      $ docker exec -it dug-search-client bash ./usr/src/app/runtime-env-vars.sh DUG_URL
    
    from the host machine that is serving the containerized application to 
    populate the JS object for the front-end.
DESCRIPTION

# # #

# initialize object string
object_string="window.env = {"
# for each cli arg, append "VAR: 'VALUE'," to the object
for varname in "$@"; do
  echo " - window.env.$varname = ${!varname}"
  object_string="${object_string}${varname}: '${!varname}', "
done
# complete object string
object_string="${object_string}}"
# write object to file
echo "$object_string" > /usr/share/nginx/html/runtime-env-vars.js

# # #
