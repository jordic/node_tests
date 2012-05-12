/*

Interactive Drawers

*/

function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}

function random(n1,n2) { return n1 + Math.floor(Math.random()*(n2-n1+1)); }



InteractiveDrawer = function()
{
  this.ox = null;
  this.oy = null;
  //this.drawer = drawer
  var p = this
  this.drawing = false
  this.typeDrawer = 'VariableLineDrawer'      
  
  this.drawStart = function(e)
  {
    p.ox = e.pageX
    p.oy = e.pageY 
    p.drawing = true
  }  

  this.draw = function(e)
  {
    if(p.drawing) {
      //p.drawer.draw( p.ox, p.oy, e.pageX, e.pageY )
      $(document).trigger('draw', [p.ox, p.oy, e.pageX, e.pageY, p.typeDrawer])
      p.ox = e.pageX
      p.oy = e.pageY
    }
  
  }

  this.drawEnd = function(e)
  {
    p.draw(e)
    p.drawing = false
  }

  $(document).bind('mousedown', this.drawStart);
  $(document).bind('mousemove', this.draw);
  $(document).bind('mouseup', this.drawEnd);
  
}

Drawers = function()
{
    this.drawers = {}
    var p = this;
    this.add = function (drawer_object) {
        p.drawers[drawer_object.name] = drawer_object
    }

    this.get = function(what) {
      return p.drawers[what]
    }

    this.draw = function(event, x1, x2, x3, x4, type)
    {
      p.get(type).draw(x1,x2,x3,x4)
    }

}

VariableLineDrawer = function(ct)
{
  var canvas = ct
  this.name = "VariableLineDrawer"
  this.draw = function(x1, y1, x2, y2)
  {
    //console.log(x1, y1, x2, y2)
    ctx = canvas.getContext('2d')      
    ctx.strokeStyle = get_random_color();
    //ctx.strokeStyle = '#666'
    ctx.lineWidth = random(1,10)/3
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke()
  }
  return this
}


LineDrawer = function(ct)
{
    var canvas = ct;
    this.name = "LineDrawer";
    this.draw = function(x1, y1, x2, y2)
    {
      //console.log(x1, y1, x2, y2)
      ctx = canvas.getContext('2d')      
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.closePath();
      ctx.stroke()

    }
    return this
    
}


/**

Socket Managers 

**/

DrawerSender = function()
{
    this.draw = function(event, x1, y1, x2, y2, type )
    {
      socket.emit('draw', {x1:x1, y1:y1, x2:x2, y2:y2, type:type})
    }

}

DrawerReceiver = function()
{
    var p = this

    this.draw = function(obj) {
      //$(document).trigger('draw', [obj.x1, obj.y1, obj.x2, obj.y2, obj.type])
      p.drawer.draw({}, obj.x1, obj.y1, obj.x2, obj.y2, obj.type)
    }

    this.set_drawer = function( drawer )
    {
      p.drawer = drawer
    }

}














