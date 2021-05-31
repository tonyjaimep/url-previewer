<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use OpenGraph;
use Storage;
use Str;
use Validator;

class Url extends Model
{
    protected $keyType = "string";
    protected $primaryKey = "url";
    public $incrementing = false;

    public $fillable = ['url'];

    protected $hidden = ['created_at', 'updated_at', 'preview_filename'];

    protected $appends = ['screenshot'];

    public function setUrlAttribute($url)
    {
        $this->attributes['url'] = $url;

        $data = OpenGraph::fetch($url);

        $image_url = "";

        if (count($data)) {
            if (isset($data['description'])) {
                $this->attributes['description'] = $data['description'];
            }

            if (isset($data['title'])) {
                $this->attributes['title'] = $data['title'];
            }

            if (isset($data['type'])) {
                $this->attributes['type'] = $data['type'];
            }

            if (isset($data['image'])) {
                $image_url = $data['image'];
            } else if (isset($data['image:secure_url'])) {
                $image_url = $data['image:secure_url'];
            }
        }

        if ($image_url == "") {
            // take a screenshot
            $encoded_url = urlencode($url);
            $key = config('services.flash.key');
            $image_url = "https://api.apiflash.com/v1/urltoimage?url=$url&access_key=$key&height=720&width=1280&format=jpeg";
        }

        if ($image_url) {
            $filename = Str::random(20) . '.jpeg';
            $file = file_get_contents($image_url);
            $path = Storage::put("screenshots/$filename", $file);
            $this->attributes['preview_filename'] = $filename;
        }
    }

    public function getScreenshotAttribute()
    {
        if (isset($this->attributes['preview_filename']))
            return Storage::url('screenshots/' . $this->attributes['preview_filename']);
    }
}
