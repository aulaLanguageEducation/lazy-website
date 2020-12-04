from flask import Flask, flash, render_template, send_from_directory, request, make_response
import sys
from wtforms import Form, validators, StringField
import os
app = Flask(__name__)
app.config['SESSION_TYPE'] = 'memcached'
app.config['SECRET_KEY'] = 'need to hide this'

app.config.update(
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax',
)
class UrlForm(Form):

    url = StringField('inp_url', validators=[validators.URL()])


@app.route('/')
def index(error=None):
    r = make_response(render_template('gapfiller_home.html', error=error))
    r.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    r.headers.set('Content-Security-Policy', "default-src 'self'")
    r.headers.set('X-Content-Type-Options', 'nosniff')
    r.headers.set('X-Frame-Options', 'SAMEORIGIN')
    r.set_cookie('username', 'flask', secure=True, httponly=True, samesite='Lax')
    return r


@app.route("/url_input", methods=['POST'])
def move_forward():
    #Moving forward code
    temp = request.form
    form = UrlForm(request.form)
    if request.method == "POST" and form.validate():
        this_url = form.this_url
        print(this_url)
        forward_message = "Moving Forward..."
        print(forward_message, file=sys.stderr)
        return send_from_directory(directory='static', filename='test.pdf', as_attachment=True)

    else:
        flash("!!!This is not valid url I'm afraid, please try a different one!!!")
        error = "not valid url I'm afraid"

        return index(error=error)
    #return render_template('thanks_page.html')

if __name__ == '__main__':
  app.run(debug=True)