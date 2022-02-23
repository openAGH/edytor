# ---------------------------------------------
# Overleaf Community Edition (overleaf/overleaf)
# ---------------------------------------------

ARG SHARELATEX_BASE_TAG=sharelatex/sharelatex-base:latest
FROM $SHARELATEX_BASE_TAG

WORKDIR /var/www/sharelatex

# Add required source files
# -------------------------
ADD server-ce/genScript.js /var/www/sharelatex/genScript.js
ADD server-ce/services.js /var/www/sharelatex/services.js
ADD services/ /var/www/sharelatex/

# Store the revision
# ------------------
ARG MONOREPO_REVISION
RUN echo "monorepo-server-ce,$MONOREPO_REVISION" > /var/www/revisions.txt

# Install npm dependencies
# ------------------------
RUN node genScript install | bash

# Compile
# --------------------
RUN node genScript compile | bash

# Copy runit service startup scripts to its location
# --------------------------------------------------
ADD server-ce/runit /etc/service


# Configure nginx
# ---------------
ADD server-ce/nginx/nginx.conf.template /etc/nginx/templates/nginx.conf.template
ADD server-ce/nginx/sharelatex.conf /etc/nginx/sites-enabled/sharelatex.conf


# Configure log rotation
# ----------------------
ADD server-ce/logrotate/sharelatex /etc/logrotate.d/sharelatex
RUN chmod 644 /etc/logrotate.d/sharelatex


# Copy Phusion Image startup scripts to its location
# --------------------------------------------------
COPY server-ce/init_scripts/ /etc/my_init.d/

# Copy app settings files
# -----------------------
COPY server-ce/settings.js /etc/sharelatex/settings.js

# ----------------------------------------------------------------------------------------------------
# OPENAGH: Configuration

# Copy OPENAGH LaTeX package
# -----------------------
COPY server-ce/openagh/openaghenvironments/ /usr/local/texlive/texmf-local/tex/latex/openagh/

# Copy latexmkrc configuration file
# -----------------------
COPY server-ce/openagh/latexmkrc /etc/

# Copy OPENAGH styles
# -----------------------
COPY server-ce/openagh/styles/ /var/www/sharelatex/web/public/static/openagh/styles/

# Copy OPENAGH icons
# -----------------------
COPY server-ce/openagh/openaghenvironments/icons/ /var/www/sharelatex/web/public/static/openagh/icons/

# Install necessery LaTeX packages
# -----------------------
RUN tlmgr install mdframed etoolbox zref needspace svg koma-script trimspaces xcolor transparent pgf import qrcode xkeyval adjustbox collectbox showlabels float ulem listings environ catchfile tex4ht luaxml upquote fontspec tex-gyre microtype kastrup luatexbase luacode make4ht

# Install Inkscape for generation pdfs files from svg images
# -----------------------
RUN add-apt-repository ppa:inkscape.dev/stable && apt -y install inkscape

# Run script that recreates TeX Live database dependencies - this step makes openagh package visible in Overleaf system
# -----------------------
RUN /usr/local/texlive/2021/texmf-dist/scripts/texlive/mktexlsr

# OPENAGH: END
# ----------------------------------------------------------------------------------------------------

# Copy grunt thin wrapper
# -----------------------
ADD server-ce/bin/grunt /usr/local/bin/grunt
RUN chmod +x /usr/local/bin/grunt

# Set Environment Variables
# --------------------------------
ENV SHARELATEX_CONFIG /etc/sharelatex/settings.js

ENV WEB_API_USER "sharelatex"

ENV SHARELATEX_APP_NAME "Overleaf Community Edition"

ENV OPTIMISE_PDF "true"

ENV NODE_ENV "production"
ENV LOG_LEVEL "info"


EXPOSE 80

WORKDIR /var/www/sharelatex/web

ENTRYPOINT ["/sbin/my_init"]

