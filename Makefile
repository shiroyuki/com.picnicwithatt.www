SERVICE_FLAG=
SCSS_PATH=static/scss
CSS_PATH=static/css

default:
	@echo 'Static command for NEP Core'
	@echo '  make service:  active the service'
	@echo '  make css:      compile CSS from SCSS'
	@echo '  make css_live: compile CSS from SCSS and update when a file is updated'
	@echo
	@echo 'For more options, run "./console".'

service: css
	@python handler.py $(SERVICE_FLAG)

css:
	@sass --update $(SCSS_PATH):$(CSS_PATH) --style compressed

css_live:
	@sass --watch $(SCSS_PATH):$(CSS_PATH) --style compressed
