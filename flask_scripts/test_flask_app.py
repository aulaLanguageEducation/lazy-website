from flask import Flask, render_template, send_file
import sys
app = Flask(__name__)

@app.route('/')
def index():
  return render_template('gapfiller_home.html')

@app.route("/mainbutton/", methods=['POST'])
def move_forward():
    #Moving forward code
    forward_message = "Moving Forward..."
    print(forward_message, file=sys.stderr)
    return send_file('static/test.pdf', as_attachment=True)

    #return render_template('thanks_page.html')

if __name__ == '__main__':
  app.run(debug=True)