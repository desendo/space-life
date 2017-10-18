/**
 * Created by lav010 on 10.10.2017.
 */
Phaser.Button.prototype.enable = function (shouldBeEnabled)
{
    if(shouldBeEnabled) {
        if(!this.enabled) {
            this.freezeFrames = false;
            this.inputEnabled = true;
            this.frame = this.enFrame;
        }
        this.enabled = true;

    }
    else
    {
        if(!this.enabled) {
            this.frame = this.disFrame;
            this.freezeFrames = true;
            this.inputEnabled = false;
        }
        this.enabled = false;


    }
};
Phaser.Button.prototype.setCustomDefaults = function (disFrame,enFrame)
{
    this.disFrame = disFrame;
    this.enFrame = enFrame;
    this.anchor.set(1,1);
    this.scale.set(2);
    this.smoothed=false;
    this.fixedToCamera = true;
};
Phaser.Group.prototype.alignGood = function (width, height, cellWidth, cellHeight, offsetX,offsetY, position, offset) {

    if (position === undefined) { position = Phaser.TOP_LEFT; }
    if (offset === undefined) { offset = 0; }

    if (this.children.length === 0 || offset > this.children.length || (width === -1 && height === -1))
    {
        return false;
    }

    var r = new Phaser.Rectangle(offsetX||0, offsetY||0, cellWidth, cellHeight);
    var w = (width * cellWidth);
    var h = (height * cellHeight);

    for (var i = offset; i < this.children.length; i++)
    {
        var child = this.children[i];

        if (child['alignIn'])
        {
            child.alignIn(r, position);
        }
        else
        {
            continue;
        }

        if (width === -1)
        {
            //  We keep laying them out horizontally until we've done them all
            r.y += cellHeight;

            if (r.y === h)
            {
                r.x += cellWidth;
                r.y = 0;
            }
        }
        else if (height === -1)
        {
            //  We keep laying them out vertically until we've done them all
            r.x += cellWidth;

            if (r.x === w)
            {
                r.x = 0;
                r.y += cellHeight;
            }
        }
        else
        {
            //  We keep laying them out until we hit the column limit
            r.x += cellWidth;

            if (r.x === w)
            {
                r.x = 0;
                r.y += cellHeight;

                if (r.y === h)
                {
                    //  We've hit the column limit, so return, even if there are children left
                    return true;
                }
            }
        }
    }

    return true;

};

